import { TravelResponse } from "./types";

export const SAMPLE_TRAVEL_RESPONSE: TravelResponse = {
  thread_id: "demo_sl_8f29c4",
  llm_calls: 4,
  isDemo: true,
  flight_results: `Live Flight Search Results (FRA -> CMB):
1. Qatar Airways QR-068 / QR-664 (via Doha DOH):
   - Outbound: Frankfurt FRA 15:40 -> Colombo CMB 08:35 (+1 day). Duration: 12h 25m.
   - Return: Colombo CMB 20:55 -> Frankfurt FRA 06:45 (+1 day). Duration: 14h 20m.
   - Price: ~LKR 162,000 per passenger roundtrip ($520 USD).
2. SriLankan Airlines UL-554 (Direct):
   - Outbound: Frankfurt FRA 16:00 -> Colombo CMB 05:40 (+1 day). Duration: 9h 40m.
   - Return: Colombo CMB 00:30 -> Frankfurt FRA 07:30. Duration: 11h 00m.
   - Price: ~LKR 185,000 per passenger roundtrip ($595 USD).`,

  hotel_results: `Top Accommodation Options in Sri Lanka (Tavily Verified):
1. Colombo: Marino Beach Hotel (4-Star, Rooftop Infinity Pool, Ocean Views) - ~LKR 18,500/night.
2. Kandy: The Grand Kandyan (5-Star, Perched on hills with mountain views) - ~LKR 15,200/night.
3. Nuwara Eliya: Jetwing St. Andrew's (Colonial Tudor Heritage, Tea Country) - ~LKR 16,800/night.
4. Ella: Ella Flower Garden Resort or 98 Acres Eco Resort (Valley Views) - ~LKR 12,000/night.
5. Galle / Unawatuna: Fairway Sunset Galle (Near historic UNESCO Dutch Fort) - ~LKR 14,000/night.`,

  itinerary: `Full 10-Day Daily Itinerary generated across Cultural Triangle & South Coast.`,

  answer: `### 1. Trip Summary
- **Destination**: Sri Lanka (Colombo, Kandy, Nuwara Eliya, Ella, Galle Fort & Bentota)
- **Origin**: Frankfurt (FRA), Germany
- **Duration**: 10 Days / 9 Nights
- **Travelers**: 2 Adults
- **Total Budget**: LKR 300,000 (~EUR 900 / $980 USD)
- **Trip Style**: Scenic Train Journeys, UNESCO Cultural Heritage, Ceylon Tea Estates & Coastal Beaches

### 2. Flight Information
Live flight options from Frankfurt (FRA) to Colombo Bandaranaike International (CMB):
- **Option 1 (Recommended)**: **Qatar Airways** via Doha (DOH). Total travel time: ~12h 25m. Approximate return price: **LKR 162,000 per adult**. Outstanding comfort and short layover.
- **Option 2 (Direct)**: **SriLankan Airlines** Direct flight UL-554. Flight duration: ~9h 40m. Approximate return price: **LKR 185,000 per adult**.
*Note: Flight airfares fluctuate based on departure dates and seasonality. Advance reservation at least 6 weeks ahead secures lowest fares.*

### 3. Hotel Suggestions
- **Colombo (Day 1)**: **Marino Beach Hotel** (~LKR 18,500/night). Features an iconic rooftop infinity pool facing the Indian Ocean.
- **Kandy (Days 2-3)**: **The Grand Kandyan** (~LKR 15,200/night). Elevated hilltop boutique retreat overlooking the Sacred Temple of the Tooth.
- **Nuwara Eliya (Days 4-5)**: **Jetwing St. Andrew's** (~LKR 16,800/night). Classic colonial charm surrounded by misty tea plantations and eucalyptus woods.
- **Ella (Days 6-7)**: **Ella Flower Garden Resort** (~LKR 12,000/night). Unmatched views of Ella Rock and lush gap valleys.
- **Galle / Unawatuna (Days 8-9)**: **Fairway Sunset Galle** (~LKR 14,000/night). Walking distance to historic Galle Dutch Fort and sunset ramparts.

### 4. Day-by-Day Itinerary

#### Day 1: Arrival in Colombo & Oceanfront Orientation
- **Destination**: Colombo
- **Activities**: Land at Bandaranaike International Airport (CMB), express transfer into Colombo city. Sunset stroll along Galle Face Green, authentic street seafood snacks, and evening visit to illuminated Gangaramaya Temple.
- **Transportation**: Airport highway express taxi (approx. LKR 8,500).
- **Accommodation**: Marino Beach Hotel Colombo.

#### Day 2: Colombo to Kandy Scenic Hill Train
- **Destination**: Kandy (Hill Capital)
- **Activities**: Morning scenic train journey ascending into tropical mountains. Check into hotel, explore the world-renowned Royal Botanical Gardens in Peradeniya with over 4,000 plant species.
- **Transportation**: 1st Class Observation Car tickets from Colombo Fort (approx. LKR 3,000 for two).
- **Accommodation**: The Grand Kandyan.

#### Day 3: Sacred Kandy Cultural Wonders
- **Destination**: Kandy
- **Activities**: Early morning ceremony at the UNESCO World Heritage Temple of the Sacred Tooth Relic. Scenic walk around Kandy Lake and visit to local Ceylon spice gardens.
- **Transportation**: Local electric tuk-tuks with metered fare (approx. LKR 2,500).
- **Accommodation**: The Grand Kandyan.

#### Day 4: Legendary Blue Train to Nuwara Eliya
- **Destination**: Nuwara Eliya (Little England)
- **Activities**: Board the world-famous blue train through cascading emerald tea terraces and waterfalls to Nanu Oya. Afternoon high tea at the historic Grand Hotel and stroll around Gregory Lake.
- **Transportation**: Reserved train tickets + station transfer (approx. LKR 4,500).
- **Accommodation**: Jetwing St. Andrew's.

#### Day 5: Pedro Tea Plantation & Horton Plains
- **Destination**: Nuwara Eliya
- **Activities**: Guided tea factory tour at Pedro Tea Estate, master tea tasting, and visit to Lovers Leap waterfall.
- **Transportation**: Private driver / tuk-tuk for hill country circuit (approx. LKR 5,000).
- **Accommodation**: Jetwing St. Andrew's.

#### Day 6: Nuwara Eliya to Ella & Nine Arch Bridge
- **Destination**: Ella
- **Activities**: Scenic downhill drive to Ella. Hike to the iconic Demodara Nine Arch Bridge to watch the colonial steam and diesel trains cross through the jungle canyon.
- **Transportation**: Private car hire or local train (approx. LKR 4,000).
- **Accommodation**: Ella Flower Garden Resort.

#### Day 7: Little Adam's Peak & Ravana Falls
- **Destination**: Ella
- **Activities**: Easy sunrise hike up Little Adam's Peak with panoramic 360-degree vistas across the Ella Gap. Afternoon swim and relaxation at Ravana Falls.
- **Transportation**: Local tuk-tuk hire (approx. LKR 2,500).
- **Accommodation**: Ella Flower Garden Resort.

#### Day 8: Ella to Southern Coast & Historic Galle Fort
- **Destination**: Galle
- **Activities**: Journey down from the misty hills to the turquoise southern coastline. Check into coastal hotel, explore 16th-century cobblestone alleys of Galle Dutch Fort, art boutiques, and sunset lighthouse.
- **Transportation**: Air-conditioned southern expressway taxi (approx. LKR 14,000).
- **Accommodation**: Fairway Sunset Galle.

#### Day 9: Unawatuna Beach & Turtle Conservation
- **Destination**: Galle & Unawatuna
- **Activities**: Morning swimming and snorkeling in golden Unawatuna Bay. Afternoon visit to the Kosgoda sea turtle sanctuary and ayurvedic spa experience.
- **Transportation**: Local coastal tuk-tuks (approx. LKR 3,000).
- **Accommodation**: Fairway Sunset Galle.

#### Day 10: Coastal Return & Airport Departure
- **Destination**: Colombo Airport (CMB)
- **Activities**: Morning breakfast by the ocean, souvenir shopping for Ceylon tea and cinnamon in Negombo or Colombo, transfer to airport for departure back to Germany.
- **Transportation**: Southern Expressway direct airport taxi (approx. LKR 12,000).
- **Accommodation**: Departure / Flight home.

### 5. Estimated Budget
| Category | Estimated Cost (LKR) | Notes |
| :--- | :--- | :--- |
| Flights (2 Adults) | 324,000 | Frankfurt - Colombo return (Qatar Airways) |
| Accommodation (9 Nights) | 134,000 | 4-star boutique twin-share rooms |
| Intercity Trains & Taxis | 49,500 | Scenic trains, expressways, private transfers |
| Meals & Authentic Dining | 50,000 | Local curries, fresh seafood, cafes |
| Sightseeing & Activities | 28,000 | Temple of Tooth, Pedro Tea, Botanical Gardens |
| SIM Cards & Miscellaneous | 12,000 | Dialog tourist eSIMs, tips, water |
| **Total Estimated Cost** | **597,500** | Initial budget adjusted for international airfare |

*Budget Optimization Tips: Staying in family-run guesthouses (Homestays) cuts accommodation costs to LKR 60,000 total. Traveling during shoulder season (May or September) saves up to 35% on flights.*

### 6. Final Recommendations
- **Electronic Visa (ETA)**: Apply for the official Sri Lanka ETA online at least 5 business days prior to departure.
- **Scenic Train Booking**: The Kandy to Ella train is rated one of the most scenic rail journeys on Earth; book 1st or 2nd class reserved seats 30 days in advance.
- **Currency & Cash**: Carry a mixture of international credit cards and cash (LKR) for rural hill country tuk-tuks, roadside king coconuts, and fruit stands.
- **Modest Attire**: When visiting sacred Buddhist and Hindu temples, ensure shoulders and knees are covered, and remove shoes and hats before entering.`
};

