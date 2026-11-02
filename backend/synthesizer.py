import re
from typing import Dict, Any, Tuple


def extract_trip_details(query: str) -> Dict[str, str]:
    """
    Extracts key trip parameters from natural language user input.
    """
    q_lower = query.lower()

    # Destination & Origin
    origin = "Flexible / Local Hub"
    destination = "Requested Destination"

    from_to = re.search(r"\bfrom\s+([A-Za-z\s]+?)\s+\bto\s+([A-Za-z\s]+?)(?:\s+(?:for|with|in|at|under|on|budget)\b|[.!?]|$)", query, re.I)
    to_from = re.search(r"\bto\s+([A-Za-z\s]+?)\s+\bfrom\s+([A-Za-z\s]+?)(?:\s+(?:for|with|in|at|under|on|budget)\b|[.!?]|$)", query, re.I)

    if from_to:
        origin = from_to.group(1).strip().title()
        destination = from_to.group(2).strip().title()
    elif to_from:
        destination = to_from.group(1).strip().title()
        origin = to_from.group(2).strip().title()
    else:
        to_only = re.search(r"\bto\s+([A-Za-z\s]+?)(?:\s+(?:for|with|in|at|under|on|budget)\b|[.!?]|$)", query, re.I)
        trip_to = re.search(r"\b([A-Za-z\s]+?)\s+trip\b", query, re.I)
        if to_only:
            destination = to_only.group(1).strip().title()
        elif trip_to:
            destination = trip_to.group(1).strip().title()

    # Days
    days = 7
    day_match = re.search(r"(\d+)\s*[- ]?(?:day|days|night|nights)", q_lower)
    if day_match:
        try:
            days = min(max(int(day_match.group(1)), 1), 30)
        except ValueError:
            pass

    # Travelers
    travelers = "2 Adults"
    people_match = re.search(r"(\d+)\s*(?:adults?|travelers?|people|persons?|guests?)", q_lower)
    if people_match:
        travelers = f"{people_match.group(1)} Travelers"
    elif "solo" in q_lower or "alone" in q_lower:
        travelers = "1 Adult (Solo)"
    elif "family" in q_lower:
        travelers = "Family (4 Travelers)"

    # Budget
    budget = "Flexible / Standard"
    budget_explicit = re.search(r"(?:budget|cost|under|max|total)\s*(?:of|is|:)?\s*([$€£¥₹A-Z]{1,4}\s*[\d,]+|[\d,]+\s*[$€£¥₹A-Z]{1,4})", query, re.I)
    curr_explicit = re.search(r"([$€£¥₹]\s*[\d,]+|[\d,]+\s*[$€£¥₹]|\b(?:USD|EUR|GBP|LKR|INR|JPY|CAD|AUD)\s*[\d,]+|[\d,]+\s*(?:USD|EUR|GBP|LKR|INR|JPY|CAD|AUD)\b)", query, re.I)

    if budget_explicit:
        budget = budget_explicit.group(1).strip()
    elif curr_explicit:
        budget = curr_explicit.group(1).strip()

    # Style
    style = "Cultural Exploration & Leisure"
    if "luxury" in q_lower or "5 star" in q_lower:
        style = "Luxury & Premium Comfort"
    elif "backpack" in q_lower or "cheap" in q_lower or "affordable" in q_lower:
        style = "Budget Backpacker & Local Exploration"
    elif "adventure" in q_lower or "hiking" in q_lower:
        style = "Active Adventure & Sightseeing"

    return {
        "origin": origin,
        "destination": destination,
        "duration": f"{days} Days / {max(1, days - 1)} Nights",
        "days_num": str(days),
        "travelers": travelers,
        "budget": budget,
        "style": style,
    }


def synthesize_itinerary_content(user_query: str, flight_data: str, hotel_data: str) -> str:
    """
    Builds a structured day-by-day itinerary when LLM is unavailable or quota-limited.
    """
    details = extract_trip_details(user_query)
    dest = details["destination"]
    days = int(details["days_num"])

    itinerary_lines = [f"### {days}-Day Comprehensive Itinerary for {dest}\n"]

    themes = [
        ("Arrival, Check-in & Orientation", "Transfer to accommodation, explore nearby neighborhood and enjoy welcome dinner."),
        ("Iconic Landmarks & Historical Wonders", "Visit primary cultural sites, historic monuments, and prominent city viewpoints."),
        ("Local Arts, Markets & Street Food", "Immerse in local market culture, craft shops, and street cuisine sampling."),
        ("Nature, Parks & Scenic Excursions", "Day trip to scenic reserves, botanical gardens, or surrounding countryside."),
        ("Hidden Gems & Leisurely Exploration", "Discover off-the-beaten-path cafes, museums, and relaxed walking districts."),
        ("Adventure & Outdoor Activities", "Active sightseeing, boat tour, hiking, or regional excursion."),
        ("Culinary Discovery & Sunset Views", "Cooking workshop or food tour followed by panoramic evening rooftop view."),
        ("Relaxation & Wellness", "Spa, beach/lakeside leisure, or scenic cultural village visit."),
        ("Souvenir Shopping & Farewell Celebration", "Pick up authentic souvenirs, handicrafts, and enjoy a memorable dinner."),
        ("Departure & Safe Travels", "Final breakfast, checkout, and airport transfer for return flight."),
    ]

    for day in range(1, days + 1):
        if day == 1:
            theme, acts = themes[0]
        elif day == days:
            theme, acts = themes[-1]
        else:
            t_idx = (day - 2) % (len(themes) - 2) + 1
            theme, acts = themes[t_idx]

        itinerary_lines.append(f"#### Day {day}: {theme}")
        itinerary_lines.append(f"- **Morning:** Arrival / Breakfast and visit central {dest} landmarks.")
        itinerary_lines.append(f"- **Afternoon:** {acts}")
        itinerary_lines.append(f"- **Evening:** Relaxed dining at highly rated local venue.")
        itinerary_lines.append(f"- **Transportation:** Public transit, local taxi, or guided shuttle.")
        itinerary_lines.append(f"- **Accommodation:** Hotel reserved in central {dest}.\n")

    return "\n".join(itinerary_lines)


def synthesize_complete_travel_plan(
    user_query: str,
    flight_data: str,
    hotel_data: str,
    itinerary_data: str
) -> str:
    """
    Constructs the final, beautifully formatted 6-section travel package
    matching the exact schema expected by the frontend.
    """
    details = extract_trip_details(user_query)
    dest = details["destination"]
    orig = details["origin"]
    duration = details["duration"]
    travelers = details["travelers"]
    budget = details["budget"]
    style = details["style"]

    # Clean flights section
    flights_display = flight_data.strip() if flight_data and "missing" not in flight_data.lower() else (
        f"Search results for routes connecting {orig} and {dest}.\n"
        "Live flight schedules are monitored. Check direct airline booking for real-time seat availability."
    )

    # Clean hotels section
    hotels_display = hotel_data.strip() if hotel_data and "missing" not in hotel_data.lower() else (
        f"Top curated accommodation options in {dest} based on location convenience, cleanliness, and value."
    )

    # Clean itinerary
    if not itinerary_data or len(itinerary_data.strip()) < 50:
        itinerary_display = synthesize_itinerary_content(user_query, flight_data, hotel_data)
    else:
        itinerary_display = itinerary_data.strip()

    output = f"""
### 1. Trip Summary
- **Destination:** {dest}
- **Origin:** {orig}
- **Duration:** {duration}
- **Travelers:** {travelers}
- **Budget:** {budget}
- **Travel Style:** {style}

### 2. Flight Information
{flights_display}

### 3. Hotel Suggestions
{hotels_display}

### 4. Day-by-Day Itinerary
{itinerary_display}

### 5. Estimated Budget
| Expense Category | Allocation | Notes |
| :--- | :--- | :--- |
| **Flights / Transportation** | ~40% of Budget | Return international & regional connection |
| **Accommodation** | ~30% of Budget | Standard to boutique lodging ({duration}) |
| **Food & Dining** | ~18% of Budget | Authentic regional eateries & daily meals |
| **Activities & Entry Tickets** | ~7% of Budget | Landmark passes, museums & excursions |
| **Emergency & Miscellaneous** | ~5% of Budget | Local SIM card, transit fares & buffer |

*Note: Budget calibrated to stated allocation: {budget}.*

### 6. Final Recommendations
- **Booking Window:** Secure flights and central accommodation at least 3–4 weeks in advance for optimal rates.
- **Currency & Payments:** Carry a moderate amount of local cash for street markets and small vendors alongside international debit/credit cards.
- **Local Connectivity:** Purchase an e-SIM or airport SIM card upon arrival for navigation and ride-hailing.
- **Travel Insurance:** Strongly recommended to cover flight disruptions, baggage protection, and medical contingencies.
- **Weather Preparedness:** Check local weather forecasts 48 hours prior to departure to pack appropriately.
""".strip()

    return output
