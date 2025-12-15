#!/usr/bin/env python3
"""
Generate realistic home care dataset for Bryntum prototype
- 10 employees (varied contracts, transport, skills)
- 30 clients (Swedish names, Stockholm addresses)
- 60 visits (time windows, priorities, mandatory/movable, task notes)
"""

import json
import random
from datetime import datetime, timedelta

# Visit types with realistic distribution
VISIT_TYPES = [
    ("Morgonomsorg", "fa-sun", ["Personlig omvårdnad", "Dusch"], 0.75, "Hög", True, False, "blue"),
    ("Insulin", "fa-syringe", ["Medicin", "Insulin"], 0.33, "Hög", True, False, "green"),
    ("Lunch & medicin", "fa-utensils", ["Matlagning", "Medicin"], 1.0, "Normal", True, True, "orange"),
    ("Promenad", "fa-walking", ["Promenad", "Träning"], 0.5, "Normal", False, True, "teal"),
    ("Kvällsmat", "fa-utensils", ["Matlagning"], 0.75, "Normal", True, True, "purple"),
    ("Trygghetslarm", "fa-bell", ["Personlig omvårdnad"], 0.33, "Akut", True, False, "red"),
    ("Sårbyte", "fa-bandaid", ["Sårvård"], 0.5, "Hög", True, False, "pink"),
    ("Städning", "fa-broom", ["Städning"], 1.0, "Låg", False, True, "gray"),
    ("Inköp", "fa-shopping-bag", ["Inköp"], 0.75, "Låg", False, True, "cyan"),
    ("Dusch", "fa-shower", ["Personlig omvårdnad", "Dusch"], 0.75, "Normal", True, False, "blue"),
    ("Kvällsomvårdnad", "fa-moon", ["Personlig omvårdnad"], 0.5, "Normal", True, True, "indigo"),
    ("Provtagning", "fa-vial", ["Provtagning"], 0.33, "Normal", True, False, "green"),
    ("Träning", "fa-dumbbell", ["Träning", "Rehab"], 0.5, "Normal", False, True, "teal"),
    ("Sällskap", "fa-coffee", ["Sällskap"], 1.0, "Låg", False, True, "yellow"),
    ("Palliativ vård", "fa-hand-holding-heart", ["Palliativ vård"], 1.5, "Hög", True, False, "purple"),
    ("Medicin morgon", "fa-pills", ["Medicin"], 0.25, "Hög", True, False, "green"),
    ("Medicin kväll", "fa-pills", ["Medicin"], 0.25, "Hög", True, True, "green"),
    ("Förflyttning", "fa-wheelchair", ["Personlig omvårdnad"], 0.5, "Normal", True, False, "blue"),
    ("Matlagning", "fa-fire", ["Matlagning"], 0.75, "Normal", False, True, "orange"),
    ("Rengöring", "fa-spray-can", ["Städning"], 1.0, "Låg", False, True, "gray"),
]

# 30 Clients (Swedish names + Stockholm addresses)
CLIENTS = [
    ("Maj-Britt Nilsson", "Götgatan 12, 116 46 Stockholm", "08-123 45 67"),
    ("Sven Persson", "Ringvägen 45, 116 61 Stockholm", "08-234 56 78"),
    ("Ahmed Al-Rashid", "Folkungagatan 88, 116 22 Stockholm", "08-345 67 89"),
    ("Elsa Demba", "Sockenvägen 23, 121 49 Enskede", "08-456 78 90"),
    ("Bengt Larsson", "Ringvägen 102, 116 61 Stockholm", "08-567 89 01"),
    ("Kerstin Öst", "Bondegatan 55, 116 33 Stockholm", "08-678 90 12"),
    ("Gunnar Ek", "Skånegatan 71, 116 37 Stockholm", "08-789 01 23"),
    ("Astrid Johansson", "Nytorgsgatan 34, 116 40 Stockholm", "08-890 12 34"),
    ("Kalle Berg", "Åsögatan 144, 116 24 Stockholm", "08-901 23 45"),
    ("Inga-Lill Olsson", "Katarina Bangata 68, 116 39 Stockholm", "08-012 34 56"),
    ("Hans Müller", "Blekingegatan 22, 116 62 Stockholm", "08-112 33 44"),
    ("Birgitta Svensdotter", "Hornsgatan 154, 117 28 Stockholm", "08-223 44 55"),
    ("Per-Ove Andersson", "Långholmsgatan 31, 117 33 Stockholm", "08-334 55 66"),
    ("Elisabeth Dahl", "Wollmar Yxkullsgatan 12, 118 50 Stockholm", "08-445 66 77"),
    ("Karl-Erik Holm", "Fatbursgatanatan 8, 116 28 Stockholm", "08-556 77 88"),
    ("Margareta Viklund", "Renstiernas gata 19, 116 31 Stockholm", "08-667 88 99"),
    ("Bertil Gustafsson", "Tjärhovsgatan 45, 116 21 Stockholm", "08-778 99 00"),
    ("Ann-Marie Karlsson", "Södermannagatan 66, 116 40 Stockholm", "08-889 00 11"),
    ("Rolf Pettersson", "Malmgårdsvägen 15, 121 46 Enskede", "08-990 11 22"),
    ("Sonja Lindberg", "Enskedevägen 88, 122 33 Enskede", "08-101 22 33"),
    ("Stig Larsson", "Johannesfredsvägen 12, 121 59 Enskede", "08-212 33 44"),
    ("Ingrid Nilsson", "Sockenplan 3, 122 62 Enskede", "08-323 44 55"),
    ("Olle Bergman", "Sturevägen 4, 122 42 Enskede", "08-434 55 66"),
    ("Karin Lund", "Björnbärsvägen 9, 122 45 Enskede", "08-545 66 77"),
    ("Gösta Nordin", "Lingonvägen 21, 122 47 Enskede", "08-656 77 88"),
    ("Eva Strömberg", "Tallkrogen 5, 122 46 Enskede", "08-767 88 99"),
    ("Nils Fernström", "Skogsbacken 18, 122 41 Enskede", "08-878 99 00"),
    ("Barbro Eklund", "Lundavägen 7, 122 47 Enskede", "08-989 00 11"),
    ("Arne Vikström", "Stureby allé 24, 122 42 Enskede", "08-090 11 22"),
    ("Gudrun Åberg", "Enskedepolen 2, 122 33 Enskede", "08-191 22 33"),
]

# Role mapping
ROLES = {
    "Personlig omvårdnad": "Undersköterska",
    "Dusch": "Undersköterska",
    "Matlagning": "Undersköterska",
    "Städning": "Vårdbiträde",
    "Inköp": "Vårdbiträde",
    "Sällskap": "Vårdbiträde",
    "Medicin": "Sjuksköterska",
    "Insulin": "Sjuksköterska",
    "Sårvård": "Sjuksköterska",
    "Provtagning": "Sjuksköterska",
    "Palliativ vård": "Sjuksköterska",
    "Promenad": "Sjukgymnast",
    "Träning": "Sjukgymnast",
    "Balans": "Sjukgymnast",
    "Rehab": "Sjukgymnast",
    "Demens": "Undersköterska",
}

# Time slots for realistic distribution across the day
MORNING = [(7, 0), (7, 15), (7, 30), (7, 45), (8, 0), (8, 15), (8, 30), (8, 45), (9, 0), (9, 15), (9, 30), (9, 45)]
MIDDAY = [(10, 0), (10, 15), (10, 30), (10, 45), (11, 0), (11, 15), (11, 30), (11, 45)]
LUNCH = [(12, 30), (12, 45), (13, 0), (13, 15), (13, 30)]
AFTERNOON = [(14, 0), (14, 15), (14, 30), (14, 45), (15, 0), (15, 15), (15, 30), (15, 45)]
EVENING = [(16, 0), (16, 15), (16, 30), (16, 45), (17, 0), (17, 15), (17, 30), (17, 45)]

ALL_SLOTS = MORNING * 2 + MIDDAY * 3 + LUNCH * 1 + AFTERNOON * 3 + EVENING * 2

def generate_visits():
    visits = []
    assignments = []
    event_id = 1
    assignment_id = 1
    
    # Generate 60 visits (2 per client on average)
    for client_idx, (client_name, address, phone) in enumerate(CLIENTS):
        # Each client gets 2 visits on average (some 1, some 2, some 3)
        num_visits = random.choice([1, 2, 2, 2, 3])
        
        for v in range(num_visits):
            if event_id > 60:
                break
            
            # Pick visit type
            visit_type, icon, skills, duration, priority, mandatory, movable, color = random.choice(VISIT_TYPES)
            
            # Determine role
            required_role = ROLES.get(skills[0], "Undersköterska")
            
            # Get time slot
            slot_idx = (event_id - 1) % len(ALL_SLOTS)
            hour, minute = ALL_SLOTS[slot_idx]
            
            # Calculate times
            start_dt = datetime(2025, 12, 4, hour, minute)
            end_dt = start_dt + timedelta(hours=duration)
            
            # Preferred window (exact appointment time)
            preferred_start = start_dt.strftime("%Y-%m-%dT%H:%M:00")
            preferred_end = end_dt.strftime("%Y-%m-%dT%H:%M:00")
            
            # Allowed window (±30 min for flexibility)
            allowed_start = (start_dt - timedelta(minutes=30)).strftime("%Y-%m-%dT%H:%M:00")
            allowed_end = (end_dt + timedelta(minutes=30)).strftime("%Y-%m-%dT%H:%M:00")
            
            visit = {
                "id": event_id,
                "name": visit_type,
                "iconCls": f"fa {icon}",
                "patient": client_name,
                "duration": duration,
                "eventColor": color,
                "requiredRole": required_role,
                "pinned": random.choice([True, True, False]) if mandatory else False,
                "travelMinutes": random.randint(3, 18),
                "address": address,
                "priority": priority,
                "mandatory": mandatory,
                "movable": movable,
                "taskNotes": f"{visit_type} för {client_name.split()[0]}. Kräver: {', '.join(skills[:2])}.",
                "preferredWindowStart": preferred_start,
                "preferredWindowEnd": preferred_end,
                "allowedWindowStart": allowed_start,
                "allowedWindowEnd": allowed_end,
                "clientPhone": phone
            }
            
            # Assign 70% of visits (leave 30% unplanned for testing)
            if random.random() < 0.70:
                # Find suitable employees (match role)
                suitable_employees = {
                    "Sjuksköterska": [1, 5, 9],
                    "Undersköterska": [2, 4, 6, 8, 10],
                    "Sjukgymnast": [3],
                    "Vårdbiträde": [7]
                }
                
                candidates = suitable_employees.get(required_role, [2, 4, 6])
                if candidates:
                    resource_id = random.choice(candidates)
                    visit["startDate"] = preferred_start
                    visit["endDate"] = preferred_end
                    
                    assignments.append({
                        "id": assignment_id,
                        "event": event_id,
                        "resource": resource_id
                    })
                    assignment_id += 1
            
            visits.append(visit)
            event_id += 1
            
            if event_id > 60:
                break
    
    return visits, assignments

# Generate data
visits, assignments = generate_visits()

# Create complete JSON structure
output = {
    "events": {"rows": visits},
    "assignments": {"rows": assignments}
}

# Print to stdout
print(json.dumps(output, indent=2, ensure_ascii=False))

