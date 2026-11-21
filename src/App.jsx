import Products from "./Products";
import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight, Menu, X, MapPin, Navigation, Phone, MessageCircle, Sprout,
  Milk, Images, ShieldCheck, Leaf, CalendarDays, LogIn, LogOut, Plus,
  Upload, IndianRupee, TrendingUp, Wallet, Wheat, ChartNoAxesCombined,
  CloudSun
} from "lucide-react";
import { isSupabaseConfigured, supabase } from "./supabase";

const MAP_URL =
  import.meta.env.VITE_GOOGLE_MAPS_URL ||
  "https://maps.app.goo.gl/Mu2KWi7jRC7hNeBg7";


const crops = [
  ["Maize", "मका", "maize.jpg"],
  ["Cotton", "कापूस", "cotton.jpg"],
  ["Sweet Lime", "मोसंबी", "mosambi.jpg"],
  ["Wheat", "गहू", "wheat.jpg"],
  ["Pearl Millet", "बाजरी", "bajra.jpg"],
  ["Tomato", "टोमॅटो", "tomato.jpg"],
  ["Cauliflower", "गोबी", "cauliflower.jpg"],
  ["Ginger", "अद्रक", "ginger.jpg"],
  ["Onion", "कांदा", "onion.jpg"]
];


const copy = {
  en: {
    nav: ["Home", "About", "Agriculture", "Dairy", "Gallery", "Contact"],
    eyebrow: "ROOTED IN THE LAND. GROWING WITH CARE.",
    hero: "Growing with nature,\\nrooted in tradition.",
    intro:
      "Kakde Agro & Livestock is a family farm in Zolegaon, Maharashtra, bringing together crop cultivation and cow dairy farming with a focus on care, quality and sustainable practices.",
    explore: "Explore our farm",
    contact: "Get in touch",
    about: "A family farm with a future-focused vision.",
    aboutText:
      "We believe good farming starts with healthy soil, responsible care for animals and thoughtful use of resources. Our farm brings agriculture and dairy together under one roof.",
    agriculture: "Agriculture",
    agriText:
      "A diverse mix of seasonal crops and cultivation activities, guided by local conditions and hands-on farm experience.",
    dairy: "Cow & Dairy Farming",
    dairyText:
      "Our dairy work is built around daily care, clean surroundings and the well-being of our cows.",
    crops: "Crops we grow",
    gallery: "Life at our farm",
    updates: "From the farm",
    contactTitle: "Come find our farm.",
    contactText:
      "We are based in Zolegaon, Maharashtra. Use the map to plan your visit or contact us for an enquiry.",
    directions: "Get directions",
    map: "Farm location",
    whatsapp: "Chat on WhatsApp",
    call: "Call the farm",
    footer: "A family farm in Zolegaon, Maharashtra.",
    admin: "Admin login",
    private: "Private farm manager",
    location: "Zolegaon, Maharashtra, India",
    noUpdates: "Farm updates will appear here when published by the admin.",
    noPhotos: "Farm photos will appear here when added by the admin."
  },

  mr: {
    nav: ["मुख्यपृष्ठ", "आमच्याबद्दल", "शेती", "दुग्धव्यवसाय", "फोटो", "संपर्क"],
    eyebrow: "मातीशी नातं. प्रगतीची वाटचाल.",
    hero: "निसर्गासोबत वाढत आहोत,\\nपरंपरेशी जोडलेले आहोत.",
    intro:
      "काकडे अ‍ॅग्रो अँड लाइव्हस्टॉक हे झोळेगाव, महाराष्ट्र येथील कौटुंबिक फार्म आहे. येथे पीक शेती आणि गायींचा दुग्धव्यवसाय यांची सांगड घालून काळजी, गुणवत्ता आणि शाश्वत शेतीला महत्त्व दिले जाते.",
    explore: "फार्म पाहा",
    contact: "संपर्क साधा",
    about: "कौटुंबिक शेती, आधुनिक विचारांसह.",
    aboutText:
      "चांगली शेती ही सुपीक माती, जनावरांची योग्य काळजी आणि संसाधनांच्या जबाबदार वापरातून घडते, असा आमचा विश्वास आहे.",
    agriculture: "शेती",
    agriText:
      "स्थानिक परिस्थिती आणि प्रत्यक्ष अनुभवावर आधारित विविध हंगामी पिकांची लागवड.",
    dairy: "गायी व दुग्धव्यवसाय",
    dairyText:
      "स्वच्छ परिसर, नियमित देखभाल आणि गायींच्या आरोग्याला प्राधान्य देणारा आमचा दुग्धव्यवसाय.",
    crops: "आमची पिके",
    gallery: "आमच्या फार्मवरील क्षण",
    updates: "फार्मवरील नवीन घडामोडी",
    contactTitle: "आमच्या फार्मला भेट द्या.",
    contactText:
      "आमचा फार्म झोळेगाव, महाराष्ट्र येथे आहे. भेटीचे नियोजन करण्यासाठी नकाशा वापरा किंवा चौकशीसाठी संपर्क साधा.",
    directions: "मार्ग शोधा",
    map: "फार्मचे ठिकाण",
    whatsapp: "WhatsApp वर संपर्क",
    call: "फोन करा",
    footer: "झोळेगाव, महाराष्ट्र येथील कौटुंबिक फार्म.",
    admin: "अ‍ॅडमिन लॉगिन",
    private: "खाजगी फार्म व्यवस्थापन",
    location: "झोळेगाव, महाराष्ट्र, भारत",
    noUpdates: "अ‍ॅडमिनने प्रकाशित केलेले अपडेट्स येथे दिसतील.",
    noPhotos: "अ‍ॅडमिनने जोडलेले फार्मचे फोटो येथे दिसतील."
  }
};

function WeatherCard() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;

    async function fetchWeather() {
      try {
        const response = await fetch(
          "https://api.open-meteo.com/v1/forecast?latitude=20.0452807&longitude=75.0201958&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&timezone=Asia%2FKolkata"
        );

        if (!response.ok) {
          throw new Error("Weather unavailable");
        }

        const data = await response.json();

        if (active) {
          setWeather(data.current);
        }
      } catch (err) {
        if (active) setError(true);
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchWeather();

    return () => {
      active = false;
    };
  }, []);

  function getCondition(code) {
    if (code === 0) return "Clear Sky";
    if ([1, 2, 3].includes(code)) return "Partly Cloudy";
    if ([45, 48].includes(code)) return "Foggy";
    if ([51, 53, 55, 56, 57].includes(code)) return "Drizzle";
    if ([61, 63, 65, 66, 67].includes(code)) return "Rain";
    if ([71, 73, 75, 77].includes(code)) return "Snow";
    if ([80, 81, 82].includes(code)) return "Rain Showers";
    if ([95, 96, 99].includes(code)) return "Thunderstorm";
    return "Unknown";
  }

  return (
    <div className="weather-card">
      
      <div className="weather-heading">
        <CloudSun size={28} />
        <div>
          <h3>Live Farm Weather</h3>
          <p>Zolegaon, Maharashtra</p>
        </div>
      </div>

      {loading ? (
        <p>Loading weather...</p>
      ) : error || !weather ? (
        <p>Unable to load weather. Please try again.</p>
      ) : (
        <>
          <div className="weather-temperature">
            {Math.round(weather.temperature_2m)}°C
          </div>

          <h3>{getCondition(weather.weather_code)}</h3>

          <div className="weather-details">
            <div>
              <span>Feels Like</span>
              <strong>{weather.apparent_temperature}°C</strong>
            </div>

            <div>
              <span>Humidity</span>
              <strong>{weather.relative_humidity_2m}%</strong>
            </div>

            <div>
              <span>Wind Speed</span>
              <strong>{weather.wind_speed_10m} km/h</strong>
            </div>

            <div>
              <span>Precipitation</span>
              <strong>{weather.precipitation} mm</strong>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function SectionTitle({ eyebrow, title, desc }) {
  return (
    <div className="section-title">
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {desc && <p>{desc}</p>}
    </div>
  );
}

export default function App() {
  const [lang, setLang] = useState("en");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [session, setSession] = useState(null);
  const [adminOpen, setAdminOpen] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [photos, setPhotos] = useState([]);
  const [dairyPhotos, setDairyPhotos] = useState([]);
  const [posts, setPosts] = useState([]);
  const [records, setRecords] = useState([]);

  const [recordType, setRecordType] = useState("expense");
  const [recordAmount, setRecordAmount] = useState("");
  const [recordCrop, setRecordCrop] = useState("Maize");
  const [recordCategory, setRecordCategory] = useState("Seeds");
  const [recordDate, setRecordDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [recordNote, setRecordNote] = useState("");

  const [postTitle, setPostTitle] = useState("");
  const [postBody, setPostBody] = useState("");
  const [notice, setNotice] = useState("");
    // Milk Daily Hisab states
  const [milkCustomers, setMilkCustomers] = useState([]);
  const [milkEntries, setMilkEntries] = useState([]);
  const [milkPayments, setMilkPayments] = useState([]);

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerRate, setCustomerRate] = useState("");

  const [milkCustomerId, setMilkCustomerId] = useState("");
  const [milkQuantity, setMilkQuantity] = useState("");
  const [milkDate, setMilkDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [milkRate, setMilkRate] = useState("");
    const [paymentCustomerId, setPaymentCustomerId] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentDate, setPaymentDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [paymentMode, setPaymentMode] = useState("Cash");
  const [paymentMonth, setPaymentMonth] = useState(
    new Date().toISOString().slice(0, 7) + "-01"
  );
  const [paymentNotes, setPaymentNotes] = useState("");
  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState("all");

  const t = copy[lang];
  const navIds = ["home", "about", "agriculture", "dairy", "gallery", "contact"];

  
  // Supabase Authentication
  useEffect(() => {
    if (!supabase) return;

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Load Milk Daily Hisab data
  useEffect(() => {
    if (!session || !isSupabaseConfigured) {
      setMilkCustomers([]);
      setMilkEntries([]);
      setMilkPayments([]);
      return;
    }

    async function loadMilkData() {
      const [
        { data: customers, error: customerError },
        { data: entries, error: entryError },
        { data: payments, error: paymentError }
      ] = await Promise.all([
        supabase.from("milk_customers").select("*").eq("active", true).order("customer_name"),
        supabase.from("milk_entries").select("*").order("entry_date", { ascending: false }),
        supabase.from("milk_payments").select("*").order("payment_date", { ascending: false })
      ]);

      if (customerError || entryError || paymentError) {
        setNotice(
          customerError?.message ||
          entryError?.message ||
          paymentError?.message
        );
        return;
      }

      setMilkCustomers(customers || []);
      setMilkEntries(entries || []);
      setMilkPayments(payments || []);
    }

    loadMilkData();
  }, [session]);

  // Public gallery and updates
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    let alive = true;

    
(async () => {
  const [
    { data: p },
    { data: u },
    { data: d }
  ] = await Promise.all([
    supabase
      .from("farm_photos")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false }),

    supabase
      .from("farm_updates")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false }),

    supabase
      .from("dairy_photos")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false })
  ]);

  if (alive) {
    setPhotos(p || []);
    setPosts(u || []);
    setDairyPhotos(d || []);
  }
})();


    return () => {
      alive = false;
    };
  }, []);

  // Private ledger records
  useEffect(() => {
    if (!session || !isSupabaseConfigured) {
      setRecords([]);
      return;
    }

    supabase
      .from("farm_ledger")
      .select("*")
      .order("entry_date", { ascending: false })
      .then(({ data, error }) => {
        if (!error) setRecords(data || []);
      });
  }, [session]);

  // Available years
  const availableYears = useMemo(() => {
    return [
      ...new Set(
        records
          .map(r => r.entry_date?.slice(0, 4))
          .filter(Boolean)
      )
    ].sort((a, b) => b.localeCompare(a));
  }, [records]);

  // Filter records by year and month
  const filteredRecords = useMemo(() => {
    return records.filter(r => {
      if (!r.entry_date) return false;

      const year = r.entry_date.slice(0, 4);
      const month = r.entry_date.slice(5, 7);

      const yearMatch =
        selectedYear === "all" || year === selectedYear;

      const monthMatch =
        selectedMonth === "all" || month === selectedMonth;

      return yearMatch && monthMatch;
    });
  }, [records, selectedYear, selectedMonth]);

  // Financial totals for selected filter
  const analyticsTotals = useMemo(() => {
    return filteredRecords.reduce(
      (a, r) => {
        const amount = Number(r.amount || 0);

        if (r.entry_type === "income") {
          a.income += amount;
        } else {
          a.expense += amount;
        }

        return a;
      },
      { income: 0, expense: 0 }
    );
  }, [filteredRecords]);

  // Crop-wise profit and loss
  const cropSummary = useMemo(() => {
    const summary = {};

    filteredRecords.forEach(r => {
      const crop = r.crop || "Other";

      if (!summary[crop]) {
        summary[crop] = { income: 0, expense: 0 };
      }

      const amount = Number(r.amount || 0);

      if (r.entry_type === "income") {
        summary[crop].income += amount;
      } else {
        summary[crop].expense += amount;
      }
    });

    return Object.entries(summary)
      .map(([crop, values]) => ({
        crop,
        income: values.income,
        expense: values.expense,
        profit: values.income - values.expense
      }))
      .sort((a, b) => b.profit - a.profit);
  }, [filteredRecords]);

  // Monthly income and expense comparison
  const monthlySummary = useMemo(() => {
    const result = [];

    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setDate(1);
      date.setMonth(date.getMonth() - i);

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");

      const monthRecords = records.filter(r =>
        r.entry_date?.startsWith(`${year}-${month}`)
      );

      const income = monthRecords
        .filter(r => r.entry_type === "income")
        .reduce((sum, r) => sum + Number(r.amount || 0), 0);

      const expense = monthRecords
        .filter(r => r.entry_type === "expense")
        .reduce((sum, r) => sum + Number(r.amount || 0), 0);

      result.push({
        label: date.toLocaleDateString("en-IN", { month: "short" }),
        income,
        expense
      });
    }

    return result;
  }, [records]);

  // Year-wise financial report
  const yearlySummary = useMemo(() => {
    return availableYears.map(year => {
      const yearRecords = records.filter(r =>
        r.entry_date?.startsWith(year)
      );

      const income = yearRecords
        .filter(r => r.entry_type === "income")
        .reduce((sum, r) => sum + Number(r.amount || 0), 0);

      const expense = yearRecords
        .filter(r => r.entry_type === "expense")
        .reduce((sum, r) => sum + Number(r.amount || 0), 0);

      return {
        year,
        income,
        expense,
        profit: income - expense
      };
    });
  }, [records, availableYears]);

  // Admin login
  async function signIn(e) {
    e.preventDefault();
    setLoginError("");

    if (!supabase) {
      setLoginError("Connect Supabase first. Follow SETUP.md.");
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      setLoginError(error.message);
    } else {
      setPassword("");
      setNotice("Signed in successfully.");
    }
  }

  // Admin logout
  async function signOut() {
    await supabase?.auth.signOut();
    setAdminOpen(false);
  }

async function uploadPhotos(e) {
  const files = Array.from(e.target.files || []);

  if (!session || !files.length) return;

  for (const file of files) {
    const safe = `${Date.now()}-${file.name.replace(
      /[^a-zA-Z0-9._-]/g,
      "-"
    )}`;

    const { error: upErr } = await supabase.storage
      .from("farm-gallery")
      .upload(safe, file, { upsert: false });

    if (upErr) {
      setNotice(upErr.message);
      continue;
    }

    const { data: { publicUrl } } = supabase.storage
      .from("farm-gallery")
      .getPublicUrl(safe);

    const { error: dbErr } = await supabase
      .from("farm_photos")
      .insert({
        image_url: publicUrl,
        caption: file.name,
        published: true
      });

    if (dbErr) setNotice(dbErr.message);
  }

  const { data, error } = await supabase
    .from("farm_photos")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (error) setNotice(error.message);
  else {
    setPhotos(data || []);
    setNotice("Photo gallery updated.");
  }

  e.target.value = "";
}

  // Upload photos
  
async function uploadDairyPhotos(e) {
  const files = Array.from(e.target.files || []);

  if (!session || !files.length) return;

  for (const file of files) {
    if (!file.type.startsWith("image/")) continue;

    const safe = `dairy/${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "-")}`;

    const { error: upErr } = await supabase.storage
      .from("farm-gallery")
      .upload(safe, file, { upsert: false });

    if (upErr) {
      setNotice(upErr.message);
      continue;
    }

    const { data: { publicUrl } } = supabase.storage
      .from("farm-gallery")
      .getPublicUrl(safe);

    const { error: dbErr } = await supabase
      .from("dairy_photos")
      .insert({
        image_url: publicUrl,
        storage_path: safe,
        caption: file.name,
        published: true
      });

    if (dbErr) setNotice(dbErr.message);
  }

  const { data, error } = await supabase
    .from("dairy_photos")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (error) setNotice(error.message);
  else {
    setDairyPhotos(data || []);
    setNotice("Dairy gallery updated successfully.");
  }

  e.target.value = "";
}

async function publishUpdate(e) {
  e.preventDefault();

  const { error } = await supabase
    .from("farm_updates")
    .insert({
      title: postTitle,
      body: postBody,
      published: true
    });

  if (error) {
    setNotice(error.message);
  } else {
    const { data, error: fetchError } = await supabase
      .from("farm_updates")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false });

    if (fetchError) {
      setNotice(fetchError.message);
    } else {
      setPosts(data || []);
      setPostTitle("");
      setPostBody("");
      setNotice("Farm update published.");
    }
  }
}

  // Add ledger entry
async function addLedger(e) {
  e.preventDefault();

  const { error } = await supabase.from("farm_ledger").insert({
    entry_type: recordType,
    amount: Number(recordAmount),
    crop: recordCrop,
    category: recordCategory,
    entry_date: recordDate,
    notes: recordNote
  });

  if (error) {
    setNotice(error.message);
  } else {
    const { data } = await supabase
      .from("farm_ledger")
      .select("*")
      .order("entry_date", { ascending: false });

    setRecords(data || []);
    setRecordAmount("");
    setRecordNote("");
    setNotice("Ledger entry saved securely.");
  }
}

// Add Milk Customer
async function addMilkCustomer(e) {
  e.preventDefault();

  if (!customerName.trim() || Number(customerRate) <= 0) {
    setNotice("Please enter customer name and valid milk rate.");
    return;
  }

  const { data, error } = await supabase
    .from("milk_customers")
    .insert({
      customer_name: customerName.trim(),
      phone: customerPhone,
      address: customerAddress,
      rate_per_liter: Number(customerRate)
    })
    .select()
    .single();

  if (error) {
    setNotice(error.message);
    return;
  }

  setMilkCustomers(prev =>
    [...prev, data].sort((a, b) =>
      a.customer_name.localeCompare(b.customer_name)
    )
  );

  setCustomerName("");
  setCustomerPhone("");
  setCustomerAddress("");
  setCustomerRate("");
  setNotice("Milk customer added successfully.");
}

// Save Daily Milk Entry
async function addMilkEntry(e) {
  e.preventDefault();

  if (!milkCustomerId || Number(milkQuantity) <= 0) {
    setNotice("Please select customer and enter valid milk quantity.");
    return;
  }

  const customer = milkCustomers.find(c => c.id === milkCustomerId);

  if (!customer) {
    setNotice("Customer not found.");
    return;
  }

  const rate = Number(milkRate || customer.rate_per_liter);

  const { data, error } = await supabase
    .from("milk_entries")
    .insert({
      customer_id: milkCustomerId,
      entry_date: milkDate,
      quantity_liters: Number(milkQuantity),
      rate_per_liter: rate
    })
    .select()
    .single();

  if (error) {
    setNotice(error.message);
    return;
  }

  setMilkEntries(prev => [data, ...prev]);
  setMilkQuantity("");
  setMilkRate("");
  setNotice("Daily milk entry saved successfully.");
}

// Save Customer Milk Payment
async function addMilkPayment(e) {
  e.preventDefault();

  if (!paymentCustomerId || Number(paymentAmount) <= 0) {
    setNotice("Please select customer and enter valid payment amount.");
    return;
  }

  const { data, error } = await supabase
    .from("milk_payments")
    .insert({
      customer_id: paymentCustomerId,
      bill_month: paymentMonth,
      payment_date: paymentDate,
      amount: Number(paymentAmount),
      payment_mode: paymentMode,
      notes: paymentNotes
    })
    .select()
    .single();

  if (error) {
    setNotice(error.message);
    return;
  }

  setMilkPayments(prev => [data, ...prev]);
  setPaymentAmount("");
  setPaymentNotes("");
  setNotice("Customer payment saved successfully.");
}

  // Remove Milk Customer (preserve old history)
  async function deleteMilkCustomer(id) {
    if (!window.confirm("Remove this customer? Old milk history will be preserved.")) return;

    const { error } = await supabase
      .from("milk_customers")
      .update({ active: false })
      .eq("id", id);

    if (error) {
      setNotice(error.message);
      return;
    }

    setMilkCustomers(prev => prev.filter(c => c.id !== id));
    setNotice("Customer removed successfully. Old history is preserved.");
  }

  // Delete Daily Milk Entry
  async function deleteMilkEntry(id) {
    if (!window.confirm("Permanently delete this milk entry?")) return;

    const { error } = await supabase
      .from("milk_entries")
      .delete()
      .eq("id", id);

    if (error) {
      setNotice(error.message);
      return;
    }

    setMilkEntries(prev => prev.filter(entry => entry.id !== id));
    setNotice("Milk entry deleted successfully.");
  }

  // Delete Customer Payment
  async function deleteMilkPayment(id) {
    if (!window.confirm("Permanently delete this payment?")) return;

    const { error } = await supabase
      .from("milk_payments")
      .delete()
      .eq("id", id);

    if (error) {
      setNotice(error.message);
      return;
    }

    setMilkPayments(prev => prev.filter(payment => payment.id !== id));
    setNotice("Payment deleted successfully.");
  }

  // Export accounting CSV
  function exportCsv() {
    const rows = [
      ["Date", "Type", "Crop", "Category", "Amount", "Notes"],
      ...records.map(r => [
        r.entry_date,
        r.entry_type,
        r.crop,
        r.category,
        r.amount,
        r.notes || ""
      ])
    ];

    const csv = rows
      .map(row =>
        row
          .map(v => `"${String(v ?? "").replaceAll('"', '""')}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob(["\ufeff" + csv], {
      type: "text/csv;charset=utf-8"
    });

    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "kakde-farm-ledger.csv";
    a.click();
    URL.revokeObjectURL(a.href);
  }

  const maxMonthlyAmount = Math.max(
    ...monthlySummary.flatMap(m => [m.income, m.expense]),
    1
  );

  return (
    <div>
    

      <header className="topbar">
        <a className="brand" href="#home">
          <span className="brand-mark">
            <Sprout size={24} />
          </span>
          <span>
            KAKDE <b>AGRO</b>
            <small>& LIVESTOCK</small>
          </span>
        </a>

        <nav className={mobileOpen ? "nav open" : "nav"}>
          {t.nav.map((n, i) => (
            <a
              key={n}
              href={`#${navIds[i]}`}
              onClick={() => setMobileOpen(false)}
            >
              {n}
            </a>
          ))}
        </nav>

        <div className="top-actions">
          <button
            className="lang-switch"
            onClick={() => setLang(lang === "en" ? "mr" : "en")}
          >
            {lang === "en" ? "मराठी" : "English"}
          </button>

          <button
            className="admin-link"
            onClick={() => setAdminOpen(true)}
          >
            <ShieldCheck size={16} />
            {t.admin}
          </button>

          <button
            className="menu-btn"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      <main>
        {/* HOME */}
        <section id="home" className="hero">
          <div className="hero-image"></div>
          <div className="hero-shade"></div>

          <div className="hero-content">
            <span className="eyebrow light">
              <Leaf size={14} />
              {t.eyebrow}
            </span>

            <h1>
              {t.hero.split("\\n").map((line, i) => (
                <React.Fragment key={i}>
                  {line}
                  {i === 0 && <br />}
                </React.Fragment>
              ))}
            </h1>

            <p>{t.intro}</p>

            <div className="hero-buttons">
              <a className="btn btn-gold" href="#agriculture">
                {t.explore}
                <ArrowUpRight size={17} />
              </a>

              <a className="btn btn-outline" href="#contact">
                {t.contact}
              </a>
            </div>

            <div className="hero-location">
              <MapPin size={16} />
              {t.location}
            </div>
          </div>

          <div className="hero-stamp">
            <Sprout size={25} />
            <span>
              GROW
              <br />
              WITH CARE
            </span>
          </div>
        </section>
                <WeatherCard />

        {/* ABOUT */}
        <section id="about" className="about section-pad">
          <div className="about-art">
            <img
              src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=85"
              alt="Green agricultural fields"
            />

            <div className="art-label">
              <span>01 / ABOUT US</span>
              <b>
                Rooted in
                <br />
                the land.
              </b>
            </div>
          </div>

          <div className="about-copy">
            <span className="eyebrow">OUR STORY</span>
            <h2>{t.about}</h2>
            <p>{t.aboutText}</p>
            <p>{t.intro}</p>

            <a className="text-link" href="#contact">
              {t.contact}
              <ArrowUpRight size={16} />
            </a>
          </div>
        </section>

        {/* AGRICULTURE */}
        <section id="agriculture" className="agri section-pad">
          <SectionTitle
            eyebrow="FROM SOIL TO HARVEST"
            title={t.agriculture}
            desc={t.agriText}
          />

         
<div className="crop-grid">
  {crops.map(([en, mr, photo], i) => (
    <div className="crop-card" key={en}>
      <span className="crop-number">0{i + 1}</span>

      <img
        src={`/images/crops/${photo}`}
        alt={en}
        className="crop-image"
        loading="lazy"
      />

      <b>{lang === "en" ? en : mr}</b>
      <small>{lang === "en" ? mr : en}</small>
    </div>
  ))}
</div>


          <div className="agri-note">
            <Wheat />
            <span>{t.crops}</span>
            <p>
              {lang === "en"
                ? "A selection of crops grown at our farm across seasons."
                : "हंगामानुसार आमच्या शेतात घेतली जाणारी विविध पिके."}
            </p>
          </div>
        </section>

        {/* DAIRY */}
        

{/* COW & DAIRY FARMING */}
<section id="dairy" className="dairy section-pad">
  <div className="dairy-photo">
    <img
      src="https://images.unsplash.com/photo-1558152761-aee570eb5cb0?auto=format&fit=crop&w=1200&q=85"
      alt="Cow at dairy farm"
    />
  </div>

  <div className="dairy-copy">
    <span className="eyebrow light">CARE EVERY DAY</span>
    <h2>{t.dairy}</h2>
    <p>{t.dairyText}</p>

    <div className="dairy-points">
      <span><Milk /> {lang === "en" ? "Daily animal care" : "जनावरांची रोजची काळजी"}</span>
      <span><Leaf /> {lang === "en" ? "Clean farm practices" : "स्वच्छ फार्म व्यवस्थापन"}</span>
      <span><ShieldCheck /> {lang === "en" ? "Responsible livestock care" : "जबाबदार पशुसंवर्धन"}</span>
    </div>
  </div>
</section>

{/* SEPARATE DAIRY PHOTO GALLERY */}
<section className="dairy-gallery-section">
  <div className="dairy-gallery-heading">
    <span className="eyebrow">KAKDE AGRO / DAIRY</span>
    <h2>Our Dairy Gallery</h2>
    <p>Healthy cows, caring hands and farm life.</p>
  </div>

  <div className="dairy-marquee">
   
<div className="dairy-marquee-track">
  {[...dairyPhotos, ...dairyPhotos].map((photo, index) => (
    <img
      key={`${photo.id}-${index}`}
      src={photo.image_url}
      alt={photo.caption || "Kakde Agro Dairy"}
      loading="lazy"
    />
  ))}
</div>

</div>
</section>

<Products />

        {/* CONTACT */}
        <section id="contact" className="contact section-pad">
          <div className="contact-copy">
            <span className="eyebrow light">VISIT KAKDE AGRO</span>
            <h2>{t.contactTitle}</h2>
            <p>{t.contactText}</p>

            <div className="contact-address">
              <MapPin />
              <div>
                <b>{t.map}</b>
                <span>{t.location}</span>
              </div>
            </div>

            <div className="contact-buttons">
              <a
                className="btn btn-gold"
                href={MAP_URL}
                target="_blank"
                rel="noreferrer"
              >
                <Navigation size={17} />
                {t.directions}
              </a>

              {import.meta.env.VITE_WHATSAPP_NUMBER && (
                <a
                  className="btn btn-outline"
                  href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <MessageCircle size={17} />
                  {t.whatsapp}
                </a>
              )}

              {import.meta.env.VITE_CONTACT_PHONE && (
                <a
                  className="btn btn-outline"
                  href={`tel:${import.meta.env.VITE_CONTACT_PHONE}`}
                >
                  <Phone size={17} />
                  {t.call}
                </a>
              )}
            </div>
          </div>

          <div className="map-frame">
            <iframe
              title="Kakde Agro farm map"
              src="https://www.google.com/maps?q=20.0452807,75.0201958&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            ></iframe>

            <a
              href={MAP_URL}
              target="_blank"
              rel="noreferrer"
              className="map-open"
            >
              {t.directions}
              <ArrowUpRight size={15} />
            </a>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer>
        <a className="brand footer-brand" href="#home">
          <span className="brand-mark">
            <Sprout />
          </span>
          <span>
            KAKDE <b>AGRO</b>
            <small>& LIVESTOCK</small>
          </span>
        </a>

        <p>{t.footer}</p>

        <div className="footer-right">
          <span>
            © {new Date().getFullYear()} Kakde Agro & Livestock
          </span>

          <button onClick={() => setAdminOpen(true)}>
            <ShieldCheck size={14} />
            {t.private}
          </button>
        </div>
      </footer>

      {/* ADMIN MODAL */}
      {adminOpen && (
        <div
          className="modal-backdrop"
          onMouseDown={e => {
            if (e.target === e.currentTarget) setAdminOpen(false);
          }}
        >
          <div className="admin-modal">
            <button
              className="modal-close"
              onClick={() => setAdminOpen(false)}
            >
              <X />
            </button>

            {!session ? (
              <div className="login-panel">
                <div className="login-icon">
                  <ShieldCheck />
                </div>

                <span className="eyebrow">PRIVATE ACCESS</span>
                <h2>Farm Admin</h2>
                <p>
                  Sign in to manage farm updates and private accounts.
                </p>

                {!isSupabaseConfigured && (
                  <div className="setup-alert">
                    Supabase is not connected yet. Complete the setup in{" "}
                    <b>SETUP.md</b> before logging in.
                  </div>
                )}

                <form onSubmit={signIn}>
                  <label>
                    Email
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      placeholder="Your admin email"
                    />
                  </label>

                  <label>
                    Password
                    <input
                      type="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                      placeholder="Your password"
                    />
                  </label>

                  {loginError && (
                    <div className="error">{loginError}</div>
                  )}

                  <button className="btn btn-green full" type="submit">
                    <LogIn size={17} />
                    Secure login
                  </button>
                </form>
              </div>
            ) : (
              <div className="dashboard">
                <div className="dash-head">
                  <div>
                    
                    <span className="eyebrow">KAKDE AGRO / PRIVATE</span>
                    <h2>Farm Dashboard</h2>
                    <p>{session.user.email}</p>
                    
                  </div>

                  <button className="signout" onClick={signOut}>
                    <LogOut size={16} />
                    Sign out
                  </button>
                </div>

                {notice && (
                  <div className="notice">
                    {notice}
                    <button onClick={() => setNotice("")}>×</button>
                  </div>
                )}

                {/* ANALYTICS FILTERS */}
                <div className="analytics-filters">
                  <label>
                    Select Year
                    <select
                      value={selectedYear}
                      onChange={e => setSelectedYear(e.target.value)}
                    >
                      <option value="all">All Years</option>
                      {availableYears.map(year => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label>
                    Select Month
                    <select
                      value={selectedMonth}
                      onChange={e => setSelectedMonth(e.target.value)}
                    >
                      <option value="all">All Months</option>
                      {Array.from({ length: 12 }, (_, i) => (
                        <option
                          key={i + 1}
                          value={String(i + 1).padStart(2, "0")}
                        >
                          {new Date(2000, i).toLocaleString("en-IN", {
                            month: "long"
                          })}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                {/* FINANCIAL SUMMARY */}
                <div className="dash-stats">
                  <div>
                    <span>Total Income</span>
                    <b>
                      ₹{analyticsTotals.income.toLocaleString("en-IN")}
                    </b>
                    <TrendingUp />
                  </div>

                  <div>
                    <span>Total Expenses</span>
                    <b>
                      ₹{analyticsTotals.expense.toLocaleString("en-IN")}
                    </b>
                    <Wallet />
                  </div>

                  <div>
                    <span>Net Balance</span>
                    <b>
                      ₹
                      {(
                        analyticsTotals.income - analyticsTotals.expense
                      ).toLocaleString("en-IN")}
                    </b>
                    <ChartNoAxesCombined />
                  </div>
                </div>

                {/* CROP-WISE REPORT */}
                <section className="dash-card crop-analytics">
                  <h3>
                    <ChartNoAxesCombined />
                    Crop-wise Profit / Loss
                  </h3>

                  {cropSummary.length === 0 ? (
                    <p>No accounting records available for this filter.</p>
                  ) : (
                    <div className="crop-analytics-list">
                      {cropSummary.map(item => (
                        <div
                          className="crop-analytics-item"
                          key={item.crop}
                        >
                          <div>
                            <b>{item.crop}</b>
                            <small>
                              Income: ₹
                              {item.income.toLocaleString("en-IN")}
                              {" · "}
                              Expense: ₹
                              {item.expense.toLocaleString("en-IN")}
                            </small>
                          </div>

                          <strong
                            className={
                              item.profit >= 0 ? "positive" : "negative"
                            }
                          >
                            {item.profit >= 0 ? "+" : "−"}₹
                            {Math.abs(item.profit).toLocaleString("en-IN")}
                          </strong>
                        </div>
                      ))}
                    </div>
                  )}
                </section>

                {/* YEAR-WISE REPORT */}
                <section className="dash-card yearly-report">
                  <h3>
                    <CalendarDays />
                    Year-wise Financial Report
                  </h3>

                  {yearlySummary.length === 0 ? (
                    <p>No yearly records available yet.</p>
                  ) : (
                    <div className="yearly-table-wrap">
                      <table className="yearly-table">
                        <thead>
                          <tr>
                            <th>Year</th>
                            <th>Income</th>
                            <th>Expense</th>
                            <th>Profit / Loss</th>
                          </tr>
                        </thead>

                        <tbody>
                          {yearlySummary.map(item => (
                            <tr key={item.year}>
                              <td>
                                <b>{item.year}</b>
                              </td>

                              <td>
                                ₹{item.income.toLocaleString("en-IN")}
                              </td>

                              <td>
                                ₹{item.expense.toLocaleString("en-IN")}
                              </td>

                              <td
                                className={
                                  item.profit >= 0
                                    ? "positive"
                                    : "negative"
                                }
                              >
                                <b>
                                  {item.profit >= 0 ? "+" : "−"}₹
                                  {Math.abs(item.profit).toLocaleString(
                                    "en-IN"
                                  )}
                                </b>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </section>

                {/* MONTHLY CHART */}
                <section className="dash-card monthly-chart">
                  <h3>
                    <ChartNoAxesCombined />
                    Monthly Income vs Expenses
                  </h3>

                  <p className="chart-subtitle">
                    Last 6 months overview
                  </p>

                  {monthlySummary.map((month, index) => (
                    <div
                      className="month-row"
                      key={`${month.label}-${index}`}
                    >
                      <b className="month-name">{month.label}</b>

                      <div className="month-bars">
                        <div className="bar-line">
                          <span className="bar-label">Income</span>

                          <div className="bar-track">
                            <div
                              className="income-bar"
                              style={{
                                width: `${
                                  (month.income / maxMonthlyAmount) * 100
                                }%`
                              }}
                            />
                          </div>

                          <span className="bar-value">
                            ₹{month.income.toLocaleString("en-IN")}
                          </span>
                        </div>

                        <div className="bar-line">
                          <span className="bar-label">Expense</span>

                          <div className="bar-track">
                            <div
                              className="expense-bar"
                              style={{
                                width: `${
                                  (month.expense / maxMonthlyAmount) * 100
                                }%`
                              }}
                            />
                          </div>

                          <span className="bar-value">
                            ₹{month.expense.toLocaleString("en-IN")}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </section>

                {/* ADMIN DASHBOARD GRID */}
                <div className="dash-grid">
                  {/* GALLERY MANAGER */}
                  <section className="dash-card">
                    <h3>
                      <Images />
                      Gallery manager
                    </h3>

                    <p>
                      Upload photos to publish them on the public gallery.
                    </p>

                    <label className="upload-button">
                      <Upload size={17} />
                      Choose photos
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={uploadPhotos}
                      />
                    </label>

                    <small>{photos.length} published photos</small>
                  </section>
                  
{/* DAIRY GALLERY MANAGER */}

                  {/* MILK CUSTOMER REGISTER */}
                  <section className="dash-card">
                    <h3>
                      <Milk />
                      Milk Customer Register
                    </h3>

                    <form onSubmit={addMilkCustomer}>
                      <label>
                        Customer Name
                        <input
                          value={customerName}
                          onChange={e => setCustomerName(e.target.value)}
                          placeholder="Enter customer name"
                          required
                        />
                      </label>

                      <label>
                        Mobile Number
                        <input
                          type="tel"
                          value={customerPhone}
                          onChange={e => setCustomerPhone(e.target.value)}
                          placeholder="Customer phone number"
                        />
                      </label>

                      <label>
                        Address
                        <input
                          value={customerAddress}
                          onChange={e => setCustomerAddress(e.target.value)}
                          placeholder="Customer address"
                        />
                      </label>

                      <label>
                        Milk Rate (₹ per litre)
                        <input
                          type="number"
                          min="0.01"
                          step="0.01"
                          value={customerRate}
                          onChange={e => setCustomerRate(e.target.value)}
                          placeholder="Example: 60"
                          required
                        />
                      </label>

                      <button className="btn btn-green full" type="submit">
                        <Plus size={16} />
                        Add Customer
                      </button>
                    </form>

                    <div className="ledger-list">
                      <b>Registered Customers ({milkCustomers.length})</b>

                      
{milkCustomers.map(customer => (
  <div key={customer.id}>
    <span>
      {customer.customer_name} · ₹
      {Number(customer.rate_per_liter).toFixed(2)}/L
    </span>

    <div className="milk-entry-actions">
      <b>{customer.phone || "No phone"}</b>
      <button
        type="button"
        className="delete-btn"
        onClick={() => deleteMilkCustomer(customer.id)}
      >
        Delete
      </button>
    </div>
  </div>
))}

                      {milkCustomers.length === 0 && (
                        <p>No customers added yet.</p>
                      )}
                    </div>
                  </section>

                  {/* DAILY MILK ENTRY */}
                  <section className="dash-card">
                    <h3>
                      <Milk />
                      Daily Milk Entry
                    </h3>

                    <form onSubmit={addMilkEntry}>
                      <label>
                        Select Customer
                        <select
                          value={milkCustomerId}
                          onChange={e => {
                            const id = e.target.value;
                            setMilkCustomerId(id);

                            const customer = milkCustomers.find(
                              c => c.id === id
                            );

                            setMilkRate(
                              customer
                                ? String(customer.rate_per_liter)
                                : ""
                            );
                          }}
                          required
                        >
                          <option value="">Choose customer</option>
                          {milkCustomers.map(customer => (
                            <option key={customer.id} value={customer.id}>
                              {customer.customer_name}
                            </option>
                          ))}
                        </select>
                      </label>

                      <label>
                        Date
                        <input
                          type="date"
                          value={milkDate}
                          onChange={e => setMilkDate(e.target.value)}
                          required
                        />
                      </label>

                      <div className="form-two">
                        <label>
                          Quantity (Litres)
                          <input
                            type="number"
                            min="0.01"
                            step="0.01"
                            value={milkQuantity}
                            onChange={e => setMilkQuantity(e.target.value)}
                            placeholder="Example: 2"
                            required
                          />
                        </label>

                        <label>
                          Rate (₹ / Litre)
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={milkRate}
                            onChange={e => setMilkRate(e.target.value)}
                            required
                          />
                        </label>
                      </div>

                      <div className="notice">
                        Total Amount: ₹
                        {(
                          Number(milkQuantity || 0) *
                          Number(milkRate || 0)
                        ).toFixed(2)}
                      </div>

                      <button
                        className="btn btn-green full"
                        type="submit"
                        disabled={milkCustomers.length === 0}
                      >
                        <Plus size={16} />
                        Save Daily Milk Entry
                      </button>
                    </form>
                  </section>

                  {/* RECENT MILK ENTRIES */}

                  {/* CUSTOMER PAYMENT TRACKING */}
                  <section className="dash-card">
                    <h3>
                      <Wallet />
                      Customer Payment Tracking
                    </h3>

                    <form onSubmit={addMilkPayment}>
                      <label>
                        Select Customer
                        <select
                          value={paymentCustomerId}
                          onChange={e => setPaymentCustomerId(e.target.value)}
                          required
                        >
                          <option value="">Choose customer</option>
                          {milkCustomers.map(customer => (
                            <option key={customer.id} value={customer.id}>
                              {customer.customer_name}
                            </option>
                          ))}
                        </select>
                      </label>

                      <label>
                        Bill Month
                        <input
                          type="month"
                          value={paymentMonth.slice(0, 7)}
                          onChange={e =>
                            setPaymentMonth(`${e.target.value}-01`)
                          }
                          required
                        />
                      </label>

                      <div className="form-two">
                        <label>
                          Payment Amount (₹)
                          <input
                            type="number"
                            min="0.01"
                            step="0.01"
                            value={paymentAmount}
                            onChange={e => setPaymentAmount(e.target.value)}
                            required
                          />
                        </label>

                        <label>
                          Payment Date
                          <input
                            type="date"
                            value={paymentDate}
                            onChange={e => setPaymentDate(e.target.value)}
                            required
                          />
                        </label>
                      </div>

                      <label>
                        Payment Mode
                        <select
                          value={paymentMode}
                          onChange={e => setPaymentMode(e.target.value)}
                        >
                          <option>Cash</option>
                          <option>UPI</option>
                          <option>Bank Transfer</option>
                        </select>
                      </label>

                      <label>
                        Notes
                        <input
                          value={paymentNotes}
                          onChange={e => setPaymentNotes(e.target.value)}
                          placeholder="Optional payment details"
                        />
                      </label>

                      <button
                        className="btn btn-green full"
                        type="submit"
                        disabled={milkCustomers.length === 0}
                      >
                        <Plus size={16} />
                        Save Payment
                      </button>
                    </form>
                    <div className="milk-payment-history">
  <h4>Recent Customer Payments</h4>

  {milkPayments.length === 0 ? (
    <p>No payments recorded yet.</p>
  ) : (
    milkPayments.slice(0, 10).map(payment => {
      const customer = milkCustomers.find(
        c => c.id === payment.customer_id
      );

      return (
        <div key={payment.id}>
          <span>
            {customer?.customer_name || "Customer"} ·{" "}
            {payment.payment_date} · {payment.payment_mode}
          </span>

          <div className="milk-entry-actions">
            <b className="positive">
              ₹{Number(payment.amount).toFixed(2)}
            </b>

            <button
              type="button"
              className="delete-btn"
              onClick={() => deleteMilkPayment(payment.id)}
            >
              Delete
            </button>
          </div>
        </div>
      );
    })
  )}
</div>
                  </section>

                  {/* CUSTOMER MONTHLY BALANCE */}
                  <section className="dash-card">
                    <h3>
                      <IndianRupee />
                      Customer Monthly Balance
                    </h3>

                    {milkCustomers.map(customer => {
                      const month = paymentMonth.slice(0, 7);

                      const totalMilk = milkEntries
                        .filter(entry =>
                          entry.customer_id === customer.id &&
                          entry.entry_date?.startsWith(month)
                        )
                        .reduce(
                          (sum, entry) => sum + Number(entry.amount || 0),
                          0
                        );

                      const totalPaid = milkPayments
                        .filter(payment =>
                          payment.customer_id === customer.id &&
                          payment.bill_month?.slice(0, 7) === month
                        )
                        .reduce(
                          (sum, payment) => sum + Number(payment.amount || 0),
                          0
                        );

                      const balance = totalMilk - totalPaid;

                      return (
                        <div className="ledger-list" key={customer.id}>
                          <div>
                            <span>
                              <b>{customer.customer_name}</b>
                              <br />
                              Milk Bill: ₹{totalMilk.toFixed(2)}
                            </span>
                            <b className="positive">
                              Paid: ₹{totalPaid.toFixed(2)}
                            </b>
                          </div>

                          <div>
                            <span>Outstanding Balance</span>
                            <b className={balance > 0 ? "negative" : "positive"}>
                              ₹{balance.toFixed(2)}
                            </b>
                          </div>
                        </div>
                      );
                    })}

                    {milkCustomers.length === 0 && (
                      <p>Add customers to view monthly balances.</p>
                    )}
                  </section>

                  <section className="dash-card">
                    <h3>
                      <CalendarDays />
                      Recent Milk Entries
                    </h3>

                    <div className="ledger-list">
                      {milkEntries.slice(0, 10).map(entry => {
  const customer = milkCustomers.find(
    c => c.id === entry.customer_id
  );

  return (
    <div key={entry.id}>
      <span>
        {customer?.customer_name || "Customer"} ·{" "}
        {entry.entry_date} ·{" "}
        {entry.quantity_liters} L
      </span>

      <div className="milk-entry-actions">
        <b className="positive">
          ₹{Number(entry.amount).toFixed(2)}
        </b>

        <button
          type="button"
          className="delete-btn"
          onClick={() => deleteMilkEntry(entry.id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
})}

                      {milkEntries.length === 0 && (
                        <p>No milk entries recorded yet.</p>
                      )}
                    </div>
                  </section>

<section className="dash-card">
  <h3>
    <Images />
    Dairy Gallery Manager
  </h3>

  <p>
    Upload new cow and dairy farming photos.
    These photos will appear in Our Dairy Gallery.
  </p>

  <label className="upload-button">
    <Upload size={17} />
    Upload Dairy Photos
    <input
      type="file"
      accept="image/*"
      multiple
      onChange={uploadDairyPhotos}
    />
  </label>

  <small>
    {dairyPhotos.length} dairy photos loaded
  </small>

  <div className="dairy-admin-preview">
    {dairyPhotos.map(photo => (
      <img
        key={photo.id}
        src={photo.image_url}
        alt={photo.caption || "Dairy photo"}
      />
    ))}
  </div>
</section>

                  {/* FARM UPDATES */}
                  <section className="dash-card">
                    <h3>
                      <CalendarDays />
                      Publish farm update
                    </h3>

                    <form onSubmit={publishUpdate}>
                      <input
                        value={postTitle}
                        onChange={e => setPostTitle(e.target.value)}
                        placeholder="Update title"
                        required
                      />

                      <textarea
                        value={postBody}
                        onChange={e => setPostBody(e.target.value)}
                        placeholder="Write a farm update..."
                        required
                      />

                      <button className="btn btn-green full">
                        <Plus size={16} />
                        Publish update
                      </button>
                    </form>
                  </section>

                  {/* PRIVATE FARM ACCOUNTING */}
                  <section className="dash-card ledger-card">
                    <h3>
                      <IndianRupee />
                      Private farm accounting
                    </h3>

                    <form onSubmit={addLedger} className="ledger-form">
                      <div className="type-switch">
                        <button
                          type="button"
                          className={
                            recordType === "expense" ? "active" : ""
                          }
                          onClick={() => setRecordType("expense")}
                        >
                          Expense
                        </button>

                        <button
                          type="button"
                          className={
                            recordType === "income" ? "active" : ""
                          }
                          onClick={() => setRecordType("income")}
                        >
                          Income
                        </button>
                      </div>

                      <div className="form-two">
                        <label>
                          Amount (₹)
                          <input
                            type="number"
                            min="0.01"
                            step="0.01"
                            value={recordAmount}
                            onChange={e =>
                              setRecordAmount(e.target.value)
                            }
                            required
                          />
                        </label>

                        <label>
                          Date
                          <input
                            type="date"
                            value={recordDate}
                            onChange={e => setRecordDate(e.target.value)}
                            required
                          />
                        </label>
                      </div>

                      <div className="form-two">
                        <label>
                          Crop / Farm
                          <select
                            value={recordCrop}
                            onChange={e => setRecordCrop(e.target.value)}
                          >
                            {[
                              ...crops.map(c => c[0]),
                              "Dairy / Cows",
                              "Common Farm"
                            ].map(c => (
                              <option key={c}>{c}</option>
                            ))}
                          </select>
                        </label>

                        <label>
                          Category
                          <select
                            value={recordCategory}
                            onChange={e =>
                              setRecordCategory(e.target.value)
                            }
                          >
                            {[
                              "Seeds",
                              "Fertilizer",
                              "Pesticides / Sprays",
                              "Labour",
                              "Tractor / Machinery",
                              "Land Preparation",
                              "Irrigation",
                              "Electricity / Diesel",
                              "Harvesting",
                              "Packing / Transport",
                              "Storage",
                              "Cattle Feed",
                              "Veterinary / Medicine",
                              "Milk Sales",
                              "Cow / Calf Sales",
                              "Manure Sales",
                              "Other"
                            ].map(c => (
                              <option key={c}>{c}</option>
                            ))}
                          </select>
                        </label>
                      </div>

                      <label>
                        Notes
                        <input
                          value={recordNote}
                          onChange={e => setRecordNote(e.target.value)}
                          placeholder="Optional details"
                        />
                      </label>

                      <button className="btn btn-green full">
                        <Plus size={16} />
                        Save ledger entry
                      </button>
                    </form>

                    <button className="export-btn" onClick={exportCsv}>
                      Export accounting as CSV
                    </button>

                    <div className="ledger-list">
                      {records.slice(0, 8).map(r => (
                        <div key={r.id}>
                          <span>
                            {r.entry_date} · {r.crop} · {r.category}
                          </span>

                          <b
                            className={
                              r.entry_type === "income"
                                ? "positive"
                                : "negative"
                            }
                          >
                            {r.entry_type === "income" ? "+" : "−"}₹
                            {Number(r.amount).toLocaleString("en-IN")}
                          </b>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
