import requests
from bs4 import BeautifulSoup
import json

def fetch_marks(username, password):
    url = "https://ta.yrdsb.ca/yrdsb/"
    data = {"username": username, "password": password}

    s = requests.Session()
    response = s.post(url, data=data)
    mark_list = []
    
    soup = BeautifulSoup(response.text, "html.parser")
    table = soup.find('table', width="85%")

    if not table:
        return {"error": "Could not retrieve marks. Invalid credentials or website structure changed."}

    rows = table.find_all('tr')[1:]

    for row in rows:
        cols = row.find_all('td')
        name = cols[0].get_text(strip=True)[:8]
        marks = cols[2]
        
        midterm = marks.find('span')
        current = marks.find('a')

        midterm_txt = midterm.get_text(strip=True) if midterm else "N/A"
        current_txt = current.get_text(strip=True) if current else "N/A"

        # Define `current_mark` correctly
        if len(current_txt) > 15:
            current_mark = current_txt[15:-1]
        elif current_txt == "Click Here":
            current_mark = "-"
        else:
            current_mark = current_txt
        
        # Append the cleaned-up dictionary
        mark_list.append({
            "course": name,
            "midterm": midterm_txt,
            "current": current_mark
        })

    if not mark_list:
        return {"error": "No marks available."}

    return {"status": "success", "grades": mark_list}
