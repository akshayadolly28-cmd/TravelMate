package com.travelmate.config;

import com.travelmate.entity.*;
import com.travelmate.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
public class DataSeeder implements CommandLineRunner {

    private final CityRepository cityRepository;
    private final PlaceRepository placeRepository;
    private final StayRepository stayRepository;
    private final FoodSpotRepository foodSpotRepository;
    private final MarketRepository marketRepository;

    public DataSeeder(
            CityRepository cityRepository,
            PlaceRepository placeRepository,
            StayRepository stayRepository,
            FoodSpotRepository foodSpotRepository,
            MarketRepository marketRepository
    ) {
        this.cityRepository = cityRepository;
        this.placeRepository = placeRepository;
        this.stayRepository = stayRepository;
        this.foodSpotRepository = foodSpotRepository;
        this.marketRepository = marketRepository;
    }

    @Override
    public void run(String... args) {
        seedCities();
        Map<String, City> cityMap = new HashMap<>();
        cityRepository.findAll().forEach(c -> cityMap.put(c.getName().toLowerCase(), c));

        seedPlaces(cityMap);
        seedStays(cityMap);
        seedFoodSpots(cityMap);
        seedMarkets(cityMap);
    }

    private void seedCities() {
        if (!cityRepository.existsByNameIgnoreCase("Hyderabad")) {
            cityRepository.save(new City("Hyderabad", "Telangana", "India",
                    "The City of Pearls blending centuries of Nizami grandeur, spicy biryanis, and modern tech hubs.",
                    "https://images.unsplash.com/photo-1605379399642-870262d3d051?auto=format&fit=crop&w=1000&q=80",
                    17.3850, 78.4867));
        }
        if (!cityRepository.existsByNameIgnoreCase("Goa")) {
            cityRepository.save(new City("Goa", "Goa", "India",
                    "India's coastal paradise celebrated for golden beaches, Portuguese heritage villas, and vibrant nightlife.",
                    "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1000&q=80",
                    15.2993, 74.1240));
        }
        if (!cityRepository.existsByNameIgnoreCase("Mumbai")) {
            cityRepository.save(new City("Mumbai", "Maharashtra", "India",
                    "The vibrant City of Dreams featuring colonial Victorian architecture, bustling street eats, and the Arabian Sea.",
                    "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1000&q=80",
                    19.0760, 72.8777));
        }
        if (!cityRepository.existsByNameIgnoreCase("Jaipur")) {
            cityRepository.save(new City("Jaipur", "Rajasthan", "India",
                    "The majestic Pink City brimming with royal palaces, hilltop desert forts, and vibrant bazaars.",
                    "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1000&q=80",
                    26.9124, 75.7873));
        }
    }

    private void seedPlaces(Map<String, City> cities) {
        City hyd = cities.get("hyderabad");
        City goa = cities.get("goa");
        City mum = cities.get("mumbai");
        City jai = cities.get("jaipur");

        // Hyderabad Places
        if (hyd != null) {
            createPlaceIfNotExists(hyd.getId(), "Charminar",
                    "Iconic 16th-century monument and mosque with 4 grand minarets surrounded by bustling bazaars.",
                    "HISTORICAL", 25.0, "09:30", "17:30", 4.6, 320,
                    "https://images.unsplash.com/photo-1605379399642-870262d3d051?auto=format&fit=crop&w=1000&q=80",
                    "October to March", "Early morning visits are best to beat both traffic and midday heat.",
                    "1 - 2 hours", "Charminar Rd, Char Kaman, Ghansi Bazaar, Hyderabad", 17.3616, 78.4747, true, true);

            createPlaceIfNotExists(hyd.getId(), "Golconda Fort",
                    "Monumental acoustic citadel with royal palaces, acoustic whispering arches, and evening light & sound shows.",
                    "HISTORICAL", 50.0, "09:00", "17:30", 4.7, 450,
                    "https://images.unsplash.com/photo-1590133324194-46487cb1a021?auto=format&fit=crop&w=1000&q=80",
                    "November to February", "Wear sturdy sports shoes; there are over 360 steps to reach the Bala Hissar top viewpoint.",
                    "3 - 4 hours", "Ibrahim Bagh, Hyderabad", 17.3833, 78.4011, true, false);

            createPlaceIfNotExists(hyd.getId(), "Hussain Sagar Lake & Buddha Statue",
                    "Heart-shaped urban lake featuring a towering monolithic white granite Buddha statue accessible by boat.",
                    "NATURE", 100.0, "08:00", "22:00", 4.4, 180,
                    "https://images.unsplash.com/photo-1626014303757-656447761005?auto=format&fit=crop&w=1000&q=80",
                    "Year-round evenings", "Take the 20-minute sunset motorboat ride for panoramic skyline photos.",
                    "1 - 2 hours", "Tank Bund Road, Hyderabad", 17.4239, 78.4738, false, true);

            createPlaceIfNotExists(hyd.getId(), "Ramoji Film City",
                    "World's largest integrated film studio complex offering movie sets, stunt shows, rides, and eco gardens.",
                    "ADVENTURE", 1350.0, "09:00", "18:00", 4.5, 600,
                    "https://images.unsplash.com/photo-1518173946687-a4c8a383392e?auto=format&fit=crop&w=1000&q=80",
                    "Winter months", "Book online in advance and arrive right at 9 AM to catch all scheduled live stunt performances.",
                    "Full Day", "Anaspur Village, Hayathnagar, Hyderabad", 17.2543, 78.6808, true, false);

            createPlaceIfNotExists(hyd.getId(), "Salar Jung Museum",
                    "One of India's three national museums holding the legendary Veiled Rebecca sculpture and musical bracket clock.",
                    "CULTURAL", 50.0, "10:00", "17:00", 4.6, 210,
                    "https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?auto=format&fit=crop&w=1000&q=80",
                    "Weekdays (Closed on Fridays)", "Gather near the central courtyard at noon to witness the iconic mechanical clock striker.",
                    "3 - 4 hours", "Darusshifa, Hyderabad", 17.3713, 78.4804, false, false);

            createPlaceIfNotExists(hyd.getId(), "Birla Mandir Hyderabad",
                    "Magnificent white marble temple perched on Naubat Pahad hill overlooking the twin cities.",
                    "RELIGIOUS", 0.0, "07:00", "21:00", 4.7, 340,
                    "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1000&q=80",
                    "Evenings at sunset", "Electronic gadgets and mobile cameras are strictly deposited outside free of charge.",
                    "1 hour", "Hill Fort Rd, Ambedkar Colony, Khairtabad, Hyderabad", 17.4062, 78.4691, true, false);
        }

        // Goa Places
        if (goa != null) {
            createPlaceIfNotExists(goa.getId(), "Baga Beach",
                    "Lively sandy stretch renowned for exhilarating water sports, seaside shacks, and vibrant sunset nightlife.",
                    "BEACHES", 0.0, "00:00", "23:59", 4.5, 520,
                    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80",
                    "November to March", "Parasailing and jet-ski operators can be bargained down slightly off-peak morning hours.",
                    "3 - 5 hours", "Baga, North Goa", 15.5553, 73.7517, true, true);

            createPlaceIfNotExists(goa.getId(), "Fort Aguada & Lighthouse",
                    "17th-century Portuguese coastal bastion overlooking the scenic confluence of the Mandovi River and Arabian Sea.",
                    "HISTORICAL", 50.0, "09:30", "18:00", 4.6, 290,
                    "https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?auto=format&fit=crop&w=1000&q=80",
                    "Late afternoon", "Visit the lower fortification wall right before sunset for breathtaking golden-hour sea panoramas.",
                    "2 hours", "Aguada Fort Area, Candolim, Goa", 15.4920, 73.7737, true, false);

            createPlaceIfNotExists(goa.getId(), "Basilica of Bom Jesus",
                    "UNESCO World Heritage Baroque landmark housing the sacred mortal remains of Saint Francis Xavier.",
                    "RELIGIOUS", 0.0, "09:00", "18:30", 4.7, 380,
                    "https://images.unsplash.com/photo-1548013146-72479768bbaa?auto=format&fit=crop&w=1000&q=80",
                    "All year round", "Modest attire covering shoulders and knees is appreciated inside the sacred hall.",
                    "1 - 2 hours", "Old Goa Road, Velha Goa", 15.5009, 73.9116, false, false);

            createPlaceIfNotExists(goa.getId(), "Dudhsagar Waterfalls",
                    "Majestic 4-tiered cascading waterfall tumbling 310 meters down Western Ghats cliffs like a sea of milk.",
                    "ADVENTURE", 500.0, "07:00", "17:00", 4.8, 410,
                    "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1000&q=80",
                    "October to February", "Rent an authorized forest jeep from Kulem for a thrilling jungle river-crossing drive.",
                    "Half Day", "Sonaulim, Goa-Karnataka border", 15.3144, 74.3143, true, true);
        }

        // Mumbai Places
        if (mum != null) {
            createPlaceIfNotExists(mum.getId(), "Gateway of India",
                    "Imperial basalt triumphal arch built in 1924 standing proudly opposite the iconic Taj Mahal Palace hotel.",
                    "HISTORICAL", 0.0, "00:00", "23:59", 4.7, 650,
                    "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1000&q=80",
                    "Sunrise or Sunset", "Ferry services to Elephanta Caves depart directly from the rear docks here.",
                    "1 - 2 hours", "Apollo Bandar, Colaba, Mumbai", 18.9220, 72.8347, true, true);

            createPlaceIfNotExists(mum.getId(), "Marine Drive (Queen's Necklace)",
                    "Graceful 3.6-kilometer C-shaped boulevard along the coastline, perfect for peaceful evening sea-breeze walks.",
                    "NATURE", 0.0, "00:00", "23:59", 4.8, 800,
                    "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=1000&q=80",
                    "8 PM to 11 PM", "Sit along the promenade tetrapods with hot cutting chai and watch the glittering city lights.",
                    "2 hours", "Netaji Subhash Chandra Bose Road, Mumbai", 18.9432, 72.8230, true, true);

            createPlaceIfNotExists(mum.getId(), "Elephanta Caves",
                    "UNESCO World Heritage island cave temples dedicated to Lord Shiva with colossal rock-cut Trimurti relief.",
                    "CULTURAL", 40.0, "09:30", "17:30", 4.6, 270,
                    "https://images.unsplash.com/photo-1600100397608-f010f4438317?auto=format&fit=crop&w=1000&q=80",
                    "November to March (Closed Mondays)", "Take the toy train from the jetty to the cave steps to save your energy for the climbs.",
                    "Half Day", "Gharapuri Island, Mumbai Harbour", 18.9633, 72.9315, false, false);

            createPlaceIfNotExists(mum.getId(), "Chhatrapati Shivaji Maharaj Terminus",
                    "Flamboyant Victorian Gothic Revival railway headquarters and UNESCO landmark glowing golden at night.",
                    "HISTORICAL", 0.0, "00:00", "23:59", 4.7, 390,
                    "https://images.unsplash.com/photo-1580619305218-8423a7ef79b4?auto=format&fit=crop&w=1000&q=80",
                    "Nighttime for illumination", "Cross the pedestrian viewing gallery bridge across the street for clean facade photographs.",
                    "1 hour", "Fort, Mumbai", 18.9400, 72.8354, false, true);
        }

        // Jaipur Places
        if (jai != null) {
            createPlaceIfNotExists(jai.getId(), "Hawa Mahal (Palace of Winds)",
                    "Intricate honeycomb pink sandstone facade with 953 jharokhas built for royal ladies to view city street life.",
                    "HISTORICAL", 50.0, "09:00", "17:00", 4.6, 580,
                    "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1000&q=80",
                    "Morning light (8:30 AM)", "Visit Wind View Cafe or Tattoo Cafe across the street for iconic facade framing photos.",
                    "1 - 2 hours", "Hawa Mahal Rd, Badi Choupad, Jaipur", 26.9239, 75.8267, true, true);

            createPlaceIfNotExists(jai.getId(), "Amber Palace (Amer Fort)",
                    "Opulent Rajput citadel nestled on rugged hills featuring the glittering Sheesh Mahal mirror palace.",
                    "HISTORICAL", 100.0, "08:00", "17:30", 4.8, 620,
                    "https://images.unsplash.com/photo-1603288967069-45d6a2f64389?auto=format&fit=crop&w=1000&q=80",
                    "Early morning or evening sound show", "Hire an authorized tourist guide inside to discover the secret underground escape tunnels.",
                    "3 - 4 hours", "Devisinghpura, Amer, Jaipur", 26.9855, 75.8513, true, true);

            createPlaceIfNotExists(jai.getId(), "Jal Mahal (Water Palace)",
                    "Picturesque 18th-century Rajput palace appearing to float serenely in the middle of Man Sagar Lake.",
                    "NATURE", 0.0, "06:00", "22:00", 4.5, 340,
                    "https://images.unsplash.com/photo-1609949279532-6a84d471ffae?auto=format&fit=crop&w=1000&q=80",
                    "Sunset and illuminated dusk", "While interior entry is restricted, walking along the manicured promenade provides stunning views.",
                    "1 hour", "Amer Road, Jaipur", 26.9535, 75.8462, false, false);

            createPlaceIfNotExists(jai.getId(), "Jantar Mantar Jaipur",
                    "UNESCO World Heritage 18th-century astronomical observatory boasting the world's largest stone sundial.",
                    "CULTURAL", 50.0, "09:00", "17:00", 4.6, 230,
                    "https://images.unsplash.com/photo-1598890777032-bde835ba27c2?auto=format&fit=crop&w=1000&q=80",
                    "Midday when the sun is highest", "Notice the shadow cast on the giant Samrat Yantra; it measures time accurate to 2 seconds!",
                    "1 - 2 hours", "Gangori Bazaar, J.D.A. Market, Pink City, Jaipur", 26.9248, 75.8246, false, false);
        }
    }

    private void seedStays(Map<String, City> cities) {
        if (stayRepository.count() > 0) return;

        City hyd = cities.get("hyderabad");
        City goa = cities.get("goa");
        City mum = cities.get("mumbai");
        City jai = cities.get("jaipur");

        // Hyderabad Stays
        if (hyd != null) {
            saveStay(hyd.getId(), "The Banjara Heritage Stay", "HOSTEL", 850.0, 4.6, 120,
                    "Clean, social backpacker accommodation with AC dorms, rooftop cafe, and co-working Wi-Fi.",
                    "Rd No. 12, Banjara Hills, Hyderabad",
                    "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80",
                    "High-speed Wi-Fi, Air Conditioning, Hot Showers, Rooftop Cafe, Lockers, Co-working Desk");

            saveStay(hyd.getId(), "Golkonda Comfort Hotel & Suites", "HOTEL", 2400.0, 4.4, 210,
                    "Modern comfort hotel situated within 15 minutes of historic monuments and Hyderabad metro.",
                    "Masab Tank, Central Hyderabad",
                    "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
                    "Complimentary Breakfast, High-speed Wi-Fi, 24/7 Front Desk, Laundry, In-house Restaurant");

            saveStay(hyd.getId(), "Nizami Haveli Homestay", "HOMESTAY", 1600.0, 4.7, 85,
                    "Traditional family-run courtyard homestay serving homemade Hyderabadi breakfast delicacies.",
                    "Old City, Near Chowmahalla Palace, Hyderabad",
                    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
                    "Free Breakfast, Garden Courtyard, Air Conditioning, Local Tour Guidance, Kitchen Access");
        }

        // Goa Stays
        if (goa != null) {
            saveStay(goa.getId(), "The Hosteller Goa Anjuna", "HOSTEL", 750.0, 4.7, 340,
                    "Vibrant backpacker haven with an outdoor swimming pool, communal lounge, and scooter rentals.",
                    "Near Anjuna Flea Market, North Goa",
                    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80",
                    "Swimming Pool, High-speed Wi-Fi, Scooter Rental Desk, Cafe, Pool Table, AC Dorms");

            saveStay(goa.getId(), "Sea Breeze Beachfront Cottages", "GUESTHOUSE", 1850.0, 4.5, 190,
                    "Cozy wooden beach cottages located just 2 minutes walking distance from Calangute beach sands.",
                    "Calangute Beach Road, North Goa",
                    "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=800&q=80",
                    "Beach Access, Air Conditioning, Balcony with Hammock, Room Service, Free Wi-Fi");

            saveStay(goa.getId(), "Portuguese Villa Heritage Homestay", "HOMESTAY", 2900.0, 4.8, 110,
                    "Restored 150-year-old Portuguese estate surrounded by lush palm groves and spice gardens.",
                    "Fontainhas Latin Quarter, Panaji, Goa",
                    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80",
                    "Traditional Breakfast, Antique Interiors, Garden Patio, Library, Air Conditioning");
        }

        // Mumbai Stays
        if (mum != null) {
            saveStay(mum.getId(), "Zostel Mumbai Andheri", "HOSTEL", 950.0, 4.6, 420,
                    "India's premier travel hostel network located close to the airport and Metro station with social vibes.",
                    "Karol Village, Andheri East, Mumbai",
                    "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80",
                    "Air Conditioned, Common Room, High-speed Wi-Fi, Cafe, Board Games, 24/7 Security");

            saveStay(mum.getId(), "Colaba Sea View Boutique Guesthouse", "GUESTHOUSE", 2200.0, 4.4, 160,
                    "Charming heritage guesthouse situated right behind Gateway of India and Colaba Causeway.",
                    "Apollo Bandar, Colaba, Mumbai",
                    "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80",
                    "Free Wi-Fi, Prime Location, AC Rooms, Elevator, Electric Kettle, Luggage Storage");

            saveStay(mum.getId(), "Bandra Coastal Homestay", "HOMESTAY", 3200.0, 4.7, 95,
                    "Chic artistic apartment homestay minutes away from trendy cafes, Bandstand, and Pali Hill.",
                    "Pali Hill, Bandra West, Mumbai",
                    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
                    "Kitchenette, High-speed Wi-Fi, Terrace Access, Smart TV, Air Conditioning");
        }

        // Jaipur Stays
        if (jai != null) {
            saveStay(jai.getId(), "Moustache Hostel Jaipur", "HOSTEL", 650.0, 4.7, 390,
                    "Award-winning Rajasthani themed hostel featuring ornate stepwell motifs and rooftop sunset dining.",
                    "Park Street, M.I. Road, Jaipur",
                    "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80",
                    "Rooftop Restaurant, Free Wi-Fi, Air Conditioning, Walking Tours, Female Dorms");

            saveStay(jai.getId(), "Kalyan Heritage Traditional Haveli", "HOTEL", 1950.0, 4.5, 230,
                    "Authentic Rajasthani boutique haveli with hand-painted fresco ceilings and rooftop fort views.",
                    "Hathroi Fort, Ajmer Road, Jaipur",
                    "https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=800&q=80",
                    "Rooftop Fort View, Complimentary Breakfast, Free Parking, Cultural Music Evenings, AC");

            saveStay(jai.getId(), "Pink City Courtyard Homestay", "HOMESTAY", 1450.0, 4.8, 140,
                    "Warm hospitality by a local Rajput family with organic home cooking and cooking masterclasses.",
                    "Civil Lines, Jaipur",
                    "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=800&q=80",
                    "Home Cooked Breakfast, Garden, High-speed Wi-Fi, Laundry, Taxi Assistance");
        }
    }

    private void seedFoodSpots(Map<String, City> cities) {
        if (foodSpotRepository.count() > 0) return;

        City hyd = cities.get("hyderabad");
        City goa = cities.get("goa");
        City mum = cities.get("mumbai");
        City jai = cities.get("jaipur");

        // Hyderabad Food
        if (hyd != null) {
            saveFood(hyd.getId(), "Paradise Biryani", "NON_VEG", "RESTAURANT", "₹₹", 320.0, "Special Mutton Dum Biryani",
                    "Legendary culinary landmark preparing authentic aromatic dum biryani since 1953.",
                    "MG Road, Secunderabad & Charminar, Hyderabad", "11:00 AM - 11:30 PM", 4.6, 850,
                    "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80");

            saveFood(hyd.getId(), "Shah Ghouse Cafe & Restaurant", "NON_VEG", "STREET_FOOD", "₹₹", 220.0, "Hyderabadi Haleem & Boti Kebab",
                    "Bustling foodie haven famous for rich slow-cooked Haleem topped with fried cashews and ghee.",
                    "Tolichowki / Charminar, Hyderabad", "12:00 PM - 01:00 AM", 4.7, 620,
                    "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80");

            saveFood(hyd.getId(), "Nimrah Cafe & Bakery", "VEG", "CAFE", "₹", 40.0, "Irani Chai & Osmania Biscuits",
                    "Heritage tea stall situated directly overlooking the Charminar arches since 1993.",
                    "Near Charminar, Ghansi Bazaar, Hyderabad", "05:00 AM - 11:30 PM", 4.8, 910,
                    "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?auto=format&fit=crop&w=800&q=80");

            saveFood(hyd.getId(), "Chutneys Hyderabad", "VEG", "RESTAURANT", "₹₹", 180.0, "Guntur Idli & 7 Signature Chutneys",
                    "Famous South Indian breakfast restaurant celebrated for piping hot ghee idlis and 7 chutneys.",
                    "Road No. 3, Banjara Hills, Hyderabad", "07:00 AM - 11:00 PM", 4.5, 410,
                    "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80");
        }

        // Goa Food
        if (goa != null) {
            saveFood(goa.getId(), "Fisherman's Wharf Goa", "NON_VEG", "RESTAURANT", "₹₹₹", 650.0, "King Prawns Balchão & Fish Curry",
                    "Scenic riverside culinary retreat serving authentic Goan seafood with live music and cocktails.",
                    "Cavelossim / Panaji, Goa", "12:00 PM - 11:00 PM", 4.7, 540,
                    "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80");

            saveFood(goa.getId(), "Vinayak Family Restaurant", "BOTH", "RESTAURANT", "₹₹", 220.0, "Authentic Goan Fish Thali",
                    "Unassuming local favorite set among rice fields, serving the freshest caught rawa fried surmai.",
                    "Assagao, North Goa", "12:30 PM - 03:30 PM, 07:00 PM - 10:30 PM", 4.8, 710,
                    "https://images.unsplash.com/photo-1610057099431-d73a1c9d2f2f?auto=format&fit=crop&w=800&q=80");

            saveFood(goa.getId(), "Infantaria Bakery & Cafe", "BOTH", "CAFE", "₹₹", 190.0, "Traditional Bebinca & Goan Poee",
                    "Iconic Calangute meeting point serving warm croissants, savory pork sausages, and layered Bebinca.",
                    "Calangute - Baga Road, Goa", "07:30 AM - 11:00 PM", 4.5, 380,
                    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80");
        }

        // Mumbai Food
        if (mum != null) {
            saveFood(mum.getId(), "Bademiya Colaba", "NON_VEG", "STREET_FOOD", "₹₹", 280.0, "Chicken Tikka Roll & Seekh Kebabs",
                    "Famous midnight street-food landmark behind Taj Mahal Hotel serving sizzling tandoori rolls.",
                    "Tulloch Rd, Apollo Bandar, Colaba, Mumbai", "05:00 PM - 03:00 AM", 4.5, 980,
                    "https://images.unsplash.com/photo-1628294895950-9805252327bc?auto=format&fit=crop&w=800&q=80");

            saveFood(mum.getId(), "Sardar Refreshments", "VEG", "STREET_FOOD", "₹", 160.0, "Butter Pav Bhaji",
                    "Renowned for its decadent, butter-soaked bhaji mashed fresh on giant cast-iron tawas.",
                    "166-A, Tardeo Road, Mumbai", "11:30 AM - 01:00 AM", 4.6, 520,
                    "https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=800&q=80");

            saveFood(mum.getId(), "Anand Stall Vile Parle", "VEG", "STREET_FOOD", "₹", 50.0, "Cheese Burst Vada Pav & Dosa",
                    "Mumbai's favorite college hangout stall dishing out crunchy hot vada pavs and fusion dosas.",
                    "Opp. Mithibai College, Vile Parle West, Mumbai", "08:00 AM - 11:30 PM", 4.7, 750,
                    "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80");
        }

        // Jaipur Food
        if (jai != null) {
            saveFood(jai.getId(), "Rawat Mishthan Bhandar", "VEG", "STREET_FOOD", "₹", 60.0, "Crispy Pyaaz Ki Kachori",
                    "Heritage sweet & snack house preparing thousands of piping hot flaky onion kachoris daily.",
                    "Station Road, Sindhi Camp, Jaipur", "06:00 AM - 10:30 PM", 4.8, 1100,
                    "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80");

            saveFood(jai.getId(), "Laxmi Mishthan Bhandar (LMB)", "VEG", "SWEETS", "₹₹", 250.0, "Paneer Ghewar & Rajasthani Thali",
                    "Historic Johari Bazaar sweet shop operating since 1727, world-renowned for its honeycomb Ghewar.",
                    "Johari Bazaar, Pink City, Jaipur", "08:00 AM - 11:00 PM", 4.6, 680,
                    "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80");

            saveFood(jai.getId(), "Tapri Central", "VEG", "CAFE", "₹₹", 140.0, "Kulhad Chai & Sauteed Bun Maska",
                    "Rooftop youth hotspot overlooking Central Park serving masala chai with modern street twists.",
                    "B-4 E, Prithviraj Road, C Scheme, Jaipur", "07:30 AM - 10:00 PM", 4.7, 590,
                    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80");
        }
    }

    private void seedMarkets(Map<String, City> cities) {
        if (marketRepository.count() > 0) return;

        City hyd = cities.get("hyderabad");
        City goa = cities.get("goa");
        City mum = cities.get("mumbai");
        City jai = cities.get("jaipur");

        // Hyderabad Markets
        if (hyd != null) {
            saveMarket(hyd.getId(), "Laad Bazaar (Choodi Bazaar)", "HANDICRAFTS", "BUDGET", "Lac Bangles, Bridal Sarees & Pearls",
                    "Historic crescent street beside Charminar renowned for hand-crafted glittering stone-studded bangles.",
                    "Charminar West Gate, Ghansi Bazaar, Hyderabad", "11:00", "22:30", 4.6, 310,
                    "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80");

            saveMarket(hyd.getId(), "Shilparamam Arts & Crafts Village", "HANDICRAFTS", "MODERATE", "Handloom Silk, Terracotta & Wood Carvings",
                    "Sprawling cultural village showcasing rural Indian artisans, live folk music, and handloom exhibitions.",
                    "Hi-Tech City, Madhapur, Hyderabad", "10:30", "20:30", 4.5, 240,
                    "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?auto=format&fit=crop&w=800&q=80");
        }

        // Goa Markets
        if (goa != null) {
            saveMarket(goa.getId(), "Anjuna Wednesday Flea Market", "STREET_MARKETS", "BUDGET", "Bohemian Clothes, Silver Jewelry, Spices & Souvenirs",
                    "Legendary open-air beach bazaar started by hippies in the 1960s with hundreds of vibrant stalls.",
                    "Anjuna Beachfront, North Goa", "09:00", "19:00", 4.6, 420,
                    "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80");

            saveMarket(goa.getId(), "Mapusa Friday Friday Bazaar", "LOCAL_BAZAARS", "BUDGET", "Goan Chouriço Sausage, Spices, Cashews & Feni",
                    "Lively traditional Friday market where village producers sell homemade preserves and ceramics.",
                    "Mapusa Municipal Market, North Goa", "08:00", "18:30", 4.5, 190,
                    "https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=800&q=80");
        }

        // Mumbai Markets
        if (mum != null) {
            saveMarket(mum.getId(), "Colaba Causeway Fashion Street", "CLOTHING", "BUDGET", "Boho Apparel, Antique Brass, Bags & Jewelry",
                    "Mumbai's most celebrated street shopping corridor lined with bargains and eclectic knick-knacks.",
                    "Shahid Bhagat Singh Rd, Colaba, Mumbai", "10:30", "22:00", 4.7, 510,
                    "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=800&q=80");

            saveMarket(mum.getId(), "Crawford Market (Mahatma Jyotiba Phule)", "LOCAL_BAZAARS", "BUDGET", "Imported Goods, Spices, Dry Fruits & Decor",
                    "Iconic Norman-Gothic indoor bazaar featuring stone carvings designed by Lockwood Kipling.",
                    "Dhobi Talao, Fort, Mumbai", "10:00", "20:00", 4.4, 280,
                    "https://images.unsplash.com/photo-1534723452862-4c874018d66d?auto=format&fit=crop&w=800&q=80");
        }

        // Jaipur Markets
        if (jai != null) {
            saveMarket(jai.getId(), "Johari Bazaar (Jewelers' Market)", "SOUVENIRS", "PREMIUM", "Kundankari Jewelry, Gemstones & Bandhej Sarees",
                    "The world capital of colored gemstones and handcrafted gold jewelry under pink arcades.",
                    "Pink City, Jaipur", "10:30", "20:30", 4.7, 430,
                    "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80");

            saveMarket(jai.getId(), "Bapu Bazaar", "CLOTHING", "BUDGET", "Mojari Leather Shoes, Jaipuri Quilts & Sanganeri Prints",
                    "Vibrant pedestrian-friendly market famous for genuine leather camel-skin juttis and block-print textiles.",
                    "Bapu Bazaar Road, Pink City, Jaipur", "11:00", "21:00", 4.8, 580,
                    "https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?auto=format&fit=crop&w=800&q=80");
        }
    }

    private void createPlaceIfNotExists(Long cityId, String name, String desc, String cat, Double fee,
                                        String open, String close, Double rating, Integer reviews,
                                        String image, String bestTime, String tips, String duration,
                                        String addr, Double lat, Double lng, Boolean popular, Boolean trending) {
        var existing = placeRepository.searchPlaces(cityId, null, null, name);
        if (existing.isEmpty()) {
            Place p = new Place();
            p.setCityId(cityId);
            p.setName(name);
            p.setDescription(desc);
            p.setCategory(cat);
            p.setEntryFee(fee);
            p.setOpeningTime(open);
            p.setClosingTime(close);
            p.setRating(rating);
            p.setReviewCount(reviews);
            p.setImageUrl(image);
            p.setBestTimeToVisit(bestTime);
            p.setTravelTips(tips);
            p.setEstimatedDuration(duration);
            p.setAddress(addr);
            p.setLatitude(lat);
            p.setLongitude(lng);
            p.setIsPopular(popular);
            p.setIsTrending(trending);
            placeRepository.save(p);
        } else {
            // Update rich fields if missing
            Place p = existing.get(0);
            if (p.getImageUrl() == null || p.getImageUrl().isBlank()) p.setImageUrl(image);
            if (p.getBestTimeToVisit() == null) p.setBestTimeToVisit(bestTime);
            if (p.getTravelTips() == null) p.setTravelTips(tips);
            if (p.getEstimatedDuration() == null) p.setEstimatedDuration(duration);
            if (p.getAddress() == null) p.setAddress(addr);
            if (p.getIsPopular() == null) p.setIsPopular(popular);
            if (p.getIsTrending() == null) p.setIsTrending(trending);
            placeRepository.save(p);
        }
    }

    private void saveStay(Long cityId, String name, String type, Double price, Double rating, Integer reviews,
                          String desc, String addr, String image, String amenities) {
        Stay s = new Stay();
        s.setCityId(cityId);
        s.setName(name);
        s.setType(type);
        s.setPricePerNight(price);
        s.setRating(rating);
        s.setReviewCount(reviews);
        s.setDescription(desc);
        s.setAddress(addr);
        s.setImageUrl(image);
        s.setAmenities(amenities);
        s.setIsBudgetFriendly(price <= 2500.0);
        s.setBookingUrl("https://www.booking.com/searchresults.html?ss=" + name.replace(" ", "+"));
        stayRepository.save(s);
    }

    private void saveFood(Long cityId, String name, String type, String cat, String priceRange, Double price,
                          String dish, String desc, String addr, String hours, Double rating, Integer reviews, String image) {
        FoodSpot f = new FoodSpot();
        f.setCityId(cityId);
        f.setName(name);
        f.setFoodType(type);
        f.setCategory(cat);
        f.setPriceRange(priceRange);
        f.setIndicativePrice(price);
        f.setMustTryDish(dish);
        f.setDescription(desc);
        f.setAddress(addr);
        f.setOpeningHours(hours);
        f.setRating(rating);
        f.setReviewCount(reviews);
        f.setImageUrl(image);
        foodSpotRepository.save(f);
    }

    private void saveMarket(Long cityId, String name, String cat, String priceLevel, String famousFor,
                            String desc, String addr, String open, String close, Double rating, Integer reviews, String image) {
        Market m = new Market();
        m.setCityId(cityId);
        m.setName(name);
        m.setCategory(cat);
        m.setPriceLevel(priceLevel);
        m.setFamousFor(famousFor);
        m.setDescription(desc);
        m.setAddress(addr);
        m.setOpeningTime(open);
        m.setClosingTime(close);
        m.setRating(rating);
        m.setReviewCount(reviews);
        m.setImageUrl(image);
        m.setMapUrl("https://www.google.com/maps/search/?api=1&query=" + name.replace(" ", "+"));
        marketRepository.save(m);
    }
}
