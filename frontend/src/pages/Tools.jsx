import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Coins,
  Languages,
  Calculator,
  CheckSquare,
  CloudSun,
  ShieldAlert,
  ArrowRightLeft,
  RotateCcw,
  Plus,
  Trash2,
  Check,
  AlertTriangle,
  PhoneCall,
  Sun,
  Cloud,
  Droplets,
  Wind
} from 'lucide-react';

export default function Tools() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'currency');

  // Sync tab with URL
  const switchTab = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  // =========================================================
  // TOOL 1: CURRENCY CONVERTER STATE
  // =========================================================
  const [currAmount, setCurrAmount] = useState(100);
  const [currFrom, setCurrFrom] = useState('USD');
  const [currTo, setCurrTo] = useState('INR');
  const [currResult, setCurrResult] = useState(null);
  const [currLoading, setCurrLoading] = useState(false);
  const [currError, setCurrError] = useState('');

  const convertCurrency = async () => {
    if (!currAmount || currAmount <= 0) return;
    setCurrLoading(true);
    setCurrError('');
    try {
      const res = await API.get('/tools/currency', {
        params: { amount: currAmount, from: currFrom, to: currTo }
      });
      setCurrResult(res.data);
    } catch (err) {
      setCurrError('Failed to calculate currency exchange.');
    } finally {
      setCurrLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'currency') {
      convertCurrency();
    }
  }, [activeTab, currFrom, currTo]);

  const swapCurrencies = () => {
    const temp = currFrom;
    setCurrFrom(currTo);
    setCurrTo(temp);
  };

  // =========================================================
  // TOOL 2: LANGUAGE TRANSLATOR STATE & PHRASEBOOK
  // =========================================================
  const [transSource, setTransSource] = useState('English');
  const [transTarget, setTransTarget] = useState('Hindi');
  const [customText, setCustomText] = useState('');
  const [phraseCategory, setPhraseCategory] = useState('GREETINGS');

  const travelPhrases = [
    {
      category: 'GREETINGS',
      english: 'Hello / Namaste',
      hindi: 'नमस्ते (Namaste)',
      telugu: 'నమస్కారం (Namaskaram)',
      marathi: 'नमस्कार (Namaskar)',
      konkani: 'नमस्कार (Namaskar)'
    },
    {
      category: 'GREETINGS',
      english: 'Thank you very much',
      hindi: 'बहुत धन्यवाद (Bahut Dhanyavaad)',
      telugu: 'చాలా ధన్యవాదాలు (Chala Dhanyavaadalu)',
      marathi: 'खूप खूप धन्यवाद (Khup Khup Dhanyavaad)',
      konkani: 'देव बरे करू (Dev bare karu)'
    },
    {
      category: 'DIRECTIONS',
      english: 'Where is the railway station / bus stop?',
      hindi: 'रेलवे स्टेशन / बस स्टॉप कहाँ है? (Railway station kahan hai?)',
      telugu: 'రైల్వే స్టేషన్ ఎక్కడ ఉంది? (Railway station ekkada undi?)',
      marathi: 'रेल्वे स्टेशन कुठे आहे? (Railway station kuthe ahe?)',
      konkani: 'रेल्वे स्टेशन खंय आसा? (Railway station khay asa?)'
    },
    {
      category: 'DIRECTIONS',
      english: 'How far is this place?',
      hindi: 'यह जगह कितनी दूर है? (Yeh jagah kitni door hai?)',
      telugu: 'ఈ ప్రదేశం ఎంత దూరం? (Ee pradesham entha dooram?)',
      marathi: 'ही जागा किती लांब आहे? (Hee jaaga kiti laamb ahe?)',
      konkani: 'ही सुवात कितली पयस आसा? (Hee suvat kitli poys asa?)'
    },
    {
      category: 'FOOD',
      english: 'How much does this cost?',
      hindi: 'इसका कितना हुआ? (Iska kitna hua?)',
      telugu: 'దీని ధర ఎంత? (Deeni dhara entha?)',
      marathi: 'ह्याची किंमत काय आहे? (Hyachi kimmat kay ahe?)',
      konkani: 'हाचे मोल कितले? (Hache mol kitle?)'
    },
    {
      category: 'FOOD',
      english: 'Please make it less spicy',
      hindi: 'कृपया तीखा कम कीजिए (Kripya teekha kam kijiye)',
      telugu: 'దయచేసి కారం తక్కువ చేయండి (Kaaram thakkuva cheyandi)',
      marathi: 'कृपया तिखट कमी करा (Krupaya tikhat kami kara)',
      konkani: 'मात्शें तिखट उणें करा (Matshe tikhat unne kara)'
    },
    {
      category: 'EMERGENCY',
      english: 'Please help me / Call police',
      hindi: 'कृपया मेरी मदद कीजिए / पुलिस बुलाइए (Kripya meri madad kijiye)',
      telugu: 'దయచేసి నాకు సహాయం చేయండి (Naaku sahaayam cheyandi)',
      marathi: 'कृपया मला मदत करा (Krupaya mala madat kara)',
      konkani: 'मात्शें म्हाका आदार करा (Matshe mhaka aadhar kara)'
    }
  ];

  const filteredPhrases = travelPhrases.filter((p) => p.category === phraseCategory);

  // =========================================================
  // TOOL 3: TRIP BUDGET CALCULATOR STATE
  // =========================================================
  const [calcNights, setCalcNights] = useState(4);
  const [calcPeople, setCalcPeople] = useState(2);
  const [calcStayPerNight, setCalcStayPerNight] = useState(1500);
  const [calcFoodPerDay, setCalcFoodPerDay] = useState(800);
  const [calcTransport, setCalcTransport] = useState(3000);
  const [calcActivities, setCalcActivities] = useState(1200);
  const [calcShopping, setCalcShopping] = useState(2000);

  const totalStayCost = Math.max(0, calcNights) * Math.max(0, calcStayPerNight);
  const totalFoodCost = Math.max(0, calcNights) * Math.max(0, calcFoodPerDay) * Math.max(1, calcPeople);
  const totalEstimatedBudget =
    totalStayCost +
    totalFoodCost +
    Math.max(0, calcTransport) +
    Math.max(0, calcActivities) * Math.max(1, calcPeople) +
    Math.max(0, calcShopping);

  const approxDailyCost =
    calcNights > 0 ? Math.round(totalEstimatedBudget / Math.max(1, calcNights)) : totalEstimatedBudget;
  const costPerPerson =
    calcPeople > 0 ? Math.round(totalEstimatedBudget / Math.max(1, calcPeople)) : totalEstimatedBudget;

  const resetCalculator = () => {
    setCalcNights(4);
    setCalcPeople(2);
    setCalcStayPerNight(1500);
    setCalcFoodPerDay(800);
    setCalcTransport(3000);
    setCalcActivities(1200);
    setCalcShopping(2000);
  };

  // =========================================================
  // TOOL 4: PACKING CHECKLIST STATE (Synced with backend DB)
  // =========================================================
  const [checklist, setChecklist] = useState([]);
  const [newItemText, setNewItemText] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('ESSENTIALS');
  const [selectedPackCat, setSelectedPackCat] = useState('ALL');
  const [loadingChecklist, setLoadingChecklist] = useState(false);

  const fetchChecklist = async () => {
    if (!user) return;
    try {
      setLoadingChecklist(true);
      const res = await API.get('/packing');
      setChecklist(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Failed to load checklist', err);
    } finally {
      setLoadingChecklist(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'packing') {
      fetchChecklist();
    }
  }, [activeTab, user]);

  const handleToggleChecklist = async (item) => {
    if (!user) {
      // Local fallback for guest
      setChecklist((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, isChecked: !i.isChecked } : i))
      );
      return;
    }
    try {
      const res = await API.put(`/packing/${item.id}`, { isChecked: !item.isChecked });
      setChecklist((prev) =>
        prev.map((i) => (i.id === item.id ? res.data : i))
      );
    } catch (err) {
      console.error('Failed to toggle item', err);
    }
  };

  const handleAddChecklistItem = async (e) => {
    e.preventDefault();
    if (!newItemText.trim()) return;

    if (!user) {
      const guestItem = {
        id: Date.now(),
        category: newItemCategory,
        itemText: newItemText.trim(),
        isChecked: false,
        isCustom: true
      };
      setChecklist((prev) => [...prev, guestItem]);
      setNewItemText('');
      return;
    }

    try {
      const res = await API.post('/packing', {
        category: newItemCategory,
        itemText: newItemText.trim()
      });
      setChecklist((prev) => [...prev, res.data]);
      setNewItemText('');
    } catch (err) {
      alert('Failed to add item.');
    }
  };

  const handleDeleteChecklistItem = async (id) => {
    if (!user) {
      setChecklist((prev) => prev.filter((i) => i.id !== id));
      return;
    }
    try {
      await API.delete(`/packing/${id}`);
      setChecklist((prev) => prev.filter((i) => i.id !== id));
    } catch (err) {
      alert('Failed to delete item.');
    }
  };

  const handleResetChecklist = async () => {
    if (!window.confirm('Reset checklist back to default travel essentials?')) return;
    if (!user) return;
    try {
      const res = await API.post('/packing/reset');
      setChecklist(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      alert('Failed to reset checklist.');
    }
  };

  const checkedCount = checklist.filter((i) => i.isChecked).length;
  const packedPercent = checklist.length > 0 ? Math.round((checkedCount / checklist.length) * 100) : 0;
  const filteredChecklist =
    selectedPackCat === 'ALL'
      ? checklist
      : checklist.filter((i) => (i.category || '').toUpperCase() === selectedPackCat);

  // =========================================================
  // TOOL 5: WEATHER STATE
  // =========================================================
  const [weatherCity, setWeatherCity] = useState('Hyderabad');
  const [weatherData, setWeatherData] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);

  const fetchWeather = async (city) => {
    setWeatherLoading(true);
    try {
      const res = await API.get('/tools/weather', { params: { city } });
      setWeatherData(res.data);
    } catch (err) {
      console.error('Weather load error', err);
    } finally {
      setWeatherLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'weather') {
      fetchWeather(weatherCity);
    }
  }, [activeTab, weatherCity]);

  return (
    <div className="tools-page-wrapper">
      <div className="page-hero-header">
        <div className="page-header-content">
          <span className="page-header-eyebrow">ESSENTIAL UTILITIES</span>
          <h1 className="page-header-title">Travel Toolkit & Utilities</h1>
          <p className="page-header-desc">
            Handy tools to calculate your budget, convert currencies, translate essential phrases, check destination weather, and keep track of packing essentials.
          </p>
        </div>
      </div>

      <div className="page-main-layout">
        {/* Navigation Tabs */}
        <div className="tools-tabs-nav-bar">
          <button
            type="button"
            className={`tools-nav-tab ${activeTab === 'currency' ? 'active' : ''}`}
            onClick={() => switchTab('currency')}
          >
            <Coins size={16} /> Currency Converter
          </button>
          <button
            type="button"
            className={`tools-nav-tab ${activeTab === 'budget' ? 'active' : ''}`}
            onClick={() => switchTab('budget')}
          >
            <Calculator size={16} /> Budget Calculator
          </button>
          <button
            type="button"
            className={`tools-nav-tab ${activeTab === 'packing' ? 'active' : ''}`}
            onClick={() => switchTab('packing')}
          >
            <CheckSquare size={16} /> Packing Checklist
          </button>
          <button
            type="button"
            className={`tools-nav-tab ${activeTab === 'weather' ? 'active' : ''}`}
            onClick={() => switchTab('weather')}
          >
            <CloudSun size={16} /> Weather Forecast
          </button>
          <button
            type="button"
            className={`tools-nav-tab ${activeTab === 'translator' ? 'active' : ''}`}
            onClick={() => switchTab('translator')}
          >
            <Languages size={16} /> Phrasebook
          </button>
          <button
            type="button"
            className={`tools-nav-tab ${activeTab === 'safety' ? 'active' : ''}`}
            onClick={() => switchTab('safety')}
          >
            <ShieldAlert size={16} /> Safety Guide
          </button>
        </div>

        {/* ========================================================
            TAB 1: CURRENCY CONVERTER
        ======================================================== */}
        {activeTab === 'currency' && (
          <div className="tool-content-card">
            <div className="tool-card-header">
              <div>
                <h3 className="tool-title">Travel Currency Converter</h3>
                <p className="tool-subtitle">Convert between Indian Rupee (INR) and popular global currencies.</p>
              </div>
              <span className="seed-badge-pill">Benchmark Rates</span>
            </div>

            <div className="currency-converter-layout mt-6">
              <div className="currency-input-row">
                <div className="form-group flex-1">
                  <label htmlFor="currency-amount">Amount:</label>
                  <input
                    id="currency-amount"
                    type="number"
                    min="1"
                    value={currAmount}
                    onChange={(e) => setCurrAmount(Number(e.target.value))}
                    className="form-input-control text-lg font-bold"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="currency-from">From Currency:</label>
                  <select
                    id="currency-from"
                    value={currFrom}
                    onChange={(e) => setCurrFrom(e.target.value)}
                    className="form-select-control font-semibold"
                  >
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                    <option value="INR">INR - Indian Rupee</option>
                    <option value="AED">AED - UAE Dirham</option>
                    <option value="SGD">SGD - Singapore Dollar</option>
                    <option value="THB">THB - Thai Baht</option>
                    <option value="CAD">CAD - Canadian Dollar</option>
                  </select>
                </div>

                <button
                  type="button"
                  onClick={swapCurrencies}
                  className="btn-currency-swap"
                  title="Swap currencies"
                >
                  <ArrowRightLeft size={18} />
                </button>

                <div className="form-group">
                  <label htmlFor="currency-to">To Currency:</label>
                  <select
                    id="currency-to"
                    value={currTo}
                    onChange={(e) => setCurrTo(e.target.value)}
                    className="form-select-control font-semibold"
                  >
                    <option value="INR">INR - Indian Rupee</option>
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                    <option value="AED">AED - UAE Dirham</option>
                    <option value="SGD">SGD - Singapore Dollar</option>
                    <option value="THB">THB - Thai Baht</option>
                  </select>
                </div>
              </div>

              {/* Conversion Result Box */}
              {currResult && (
                <div className="currency-result-card mt-6">
                  <span className="currency-formula">
                    {currAmount} {currFrom} =
                  </span>
                  <div className="currency-result-number">
                    {currResult.convertedAmount.toLocaleString()} {currTo}
                  </div>
                  <div className="currency-meta-info">
                    <span>1 {currFrom} = {currResult.rate} {currTo}</span>
                    <span>·</span>
                    <span>Calculated as of: {currResult.timestamp}</span>
                  </div>
                  <p className="currency-disclaimer">
                    *{currResult.note}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 2: TRIP BUDGET CALCULATOR
        ======================================================== */}
        {activeTab === 'budget' && (
          <div className="tool-content-card">
            <div className="tool-card-header">
              <div>
                <h3 className="tool-title">Trip Expense & Budget Calculator</h3>
                <p className="tool-subtitle">Estimate accommodation, meals, transit, and activities with per-day breakdowns.</p>
              </div>
              <button type="button" onClick={resetCalculator} className="btn-filter-reset">
                <RotateCcw size={14} /> Reset
              </button>
            </div>

            <div className="budget-calculator-grid mt-6">
              {/* Inputs Column */}
              <div className="calculator-inputs-column">
                <div className="form-grid-2">
                  <div className="form-group">
                    <label htmlFor="calc-nights">Trip Duration (Nights):</label>
                    <input
                      id="calc-nights"
                      type="number"
                      min="1"
                      max="60"
                      value={calcNights}
                      onChange={(e) => setCalcNights(Number(e.target.value))}
                      className="form-input-control"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="calc-people">Number of Travelers:</label>
                    <input
                      id="calc-people"
                      type="number"
                      min="1"
                      max="20"
                      value={calcPeople}
                      onChange={(e) => setCalcPeople(Number(e.target.value))}
                      className="form-input-control"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="calc-stay">Accommodation (₹ per night):</label>
                  <input
                    id="calc-stay"
                    type="number"
                    min="0"
                    step="100"
                    value={calcStayPerNight}
                    onChange={(e) => setCalcStayPerNight(Number(e.target.value))}
                    className="form-input-control"
                  />
                  <span className="text-xs text-muted">Total Stay: ₹{totalStayCost.toLocaleString()}</span>
                </div>

                <div className="form-group">
                  <label htmlFor="calc-food">Daily Food & Drinks (₹ per person/day):</label>
                  <input
                    id="calc-food"
                    type="number"
                    min="0"
                    step="50"
                    value={calcFoodPerDay}
                    onChange={(e) => setCalcFoodPerDay(Number(e.target.value))}
                    className="form-input-control"
                  />
                  <span className="text-xs text-muted">Total Food: ₹{totalFoodCost.toLocaleString()}</span>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label htmlFor="calc-transit">Transit & Cabs (₹ Total):</label>
                    <input
                      id="calc-transit"
                      type="number"
                      min="0"
                      step="200"
                      value={calcTransport}
                      onChange={(e) => setCalcTransport(Number(e.target.value))}
                      className="form-input-control"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="calc-act">Sightseeing & Entry Fees (₹ per person):</label>
                    <input
                      id="calc-act"
                      type="number"
                      min="0"
                      step="100"
                      value={calcActivities}
                      onChange={(e) => setCalcActivities(Number(e.target.value))}
                      className="form-input-control"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="calc-shop">Shopping & Emergency Buffer (₹):</label>
                  <input
                    id="calc-shop"
                    type="number"
                    min="0"
                    step="200"
                    value={calcShopping}
                    onChange={(e) => setCalcShopping(Number(e.target.value))}
                    className="form-input-control"
                  />
                </div>
              </div>

              {/* Summary / Output Card */}
              <div className="calculator-output-card">
                <span className="summary-eyebrow">ESTIMATED TOTAL BUDGET</span>
                <div className="summary-total-amount">
                  ₹{totalEstimatedBudget.toLocaleString()}
                </div>
                <div className="summary-meta-pills">
                  <span>₹{approxDailyCost.toLocaleString()} / day</span>
                  <span>·</span>
                  <span>₹{costPerPerson.toLocaleString()} / traveler</span>
                </div>

                <hr className="my-5 border-slate-200" />

                <h4 className="text-sm font-bold text-navy mb-3">Cost Breakdown</h4>
                <div className="breakdown-list">
                  <div className="breakdown-row">
                    <span>Stay ({calcNights} nights)</span>
                    <span className="font-semibold">₹{totalStayCost.toLocaleString()}</span>
                  </div>
                  <div className="breakdown-row">
                    <span>Food & Dining</span>
                    <span className="font-semibold">₹{totalFoodCost.toLocaleString()}</span>
                  </div>
                  <div className="breakdown-row">
                    <span>Flights / Train / Cabs</span>
                    <span className="font-semibold">₹{calcTransport.toLocaleString()}</span>
                  </div>
                  <div className="breakdown-row">
                    <span>Sightseeing & Activities</span>
                    <span className="font-semibold">₹{(calcActivities * calcPeople).toLocaleString()}</span>
                  </div>
                  <div className="breakdown-row">
                    <span>Shopping & Buffer</span>
                    <span className="font-semibold">₹{calcShopping.toLocaleString()}</span>
                  </div>
                </div>

                <div className="mt-6">
                  <Link to="/trips" className="btn-primary-sm w-full text-center block">
                    Apply Budget to a New Trip →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 3: PACKING CHECKLIST
        ======================================================== */}
        {activeTab === 'packing' && (
          <div className="tool-content-card">
            <div className="tool-card-header">
              <div>
                <h3 className="tool-title">Travel Packing Checklist</h3>
                <p className="tool-subtitle">
                  {user ? 'Your checklist is automatically synced to your database account.' : 'Log in to permanently save your checklist across devices.'}
                </p>
              </div>
              {user && (
                <button type="button" onClick={handleResetChecklist} className="btn-filter-reset">
                  <RotateCcw size={14} /> Reset Defaults
                </button>
              )}
            </div>

            {/* Packing Progress Bar */}
            <div className="packing-progress-bar-container mt-4">
              <div className="flex justify-between items-center text-sm font-semibold text-navy mb-1">
                <span>Packing Progress</span>
                <span>{checkedCount} of {checklist.length} items packed ({packedPercent}%)</span>
              </div>
              <div className="budget-progress-bar-bg">
                <div
                  className="budget-progress-fill bg-teal"
                  style={{ width: `${packedPercent}%` }}
                />
              </div>
            </div>

            {/* Add Custom Item Form */}
            <form onSubmit={handleAddChecklistItem} className="add-checklist-item-form mt-6">
              <select
                value={newItemCategory}
                onChange={(e) => setNewItemCategory(e.target.value)}
                className="form-select-control w-auto"
              >
                <option value="ESSENTIALS">Essentials</option>
                <option value="DOCUMENTS">Documents</option>
                <option value="CLOTHES">Clothes</option>
                <option value="TOILETRIES">Toiletries</option>
                <option value="ELECTRONICS">Electronics</option>
                <option value="HEALTH">Health</option>
              </select>

              <input
                type="text"
                placeholder="Add custom packing item (e.g. Swimwear, Camera tripod)..."
                value={newItemText}
                onChange={(e) => setNewItemText(e.target.value)}
                className="form-input-control flex-1"
              />

              <button type="submit" className="btn-filter-apply">
                <Plus size={16} /> Add Item
              </button>
            </form>

            {/* Checklist Category Filter */}
            <div className="category-chips-scroll mt-4">
              {['ALL', 'DOCUMENTS', 'ELECTRONICS', 'CLOTHES', 'TOILETRIES', 'HEALTH', 'ESSENTIALS'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`filter-chip ${selectedPackCat === cat ? 'active' : ''}`}
                  onClick={() => setSelectedPackCat(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Checklist Items List */}
            <div className="checklist-items-grid mt-6">
              {filteredChecklist.map((item) => (
                <div
                  key={item.id}
                  className={`checklist-item-box ${item.isChecked ? 'is-checked' : ''}`}
                  onClick={() => handleToggleChecklist(item)}
                >
                  <div className={`checkbox-custom ${item.isChecked ? 'checked' : ''}`}>
                    {item.isChecked && <Check size={14} className="text-white" />}
                  </div>

                  <div className="checklist-item-text-col">
                    <span className={`checklist-item-text ${item.isChecked ? 'line-through text-muted' : 'text-navy'}`}>
                      {item.itemText}
                    </span>
                    <span className="checklist-category-badge">{item.category}</span>
                  </div>

                  {item.isCustom && (
                    <button
                      type="button"
                      className="btn-delete-checklist"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteChecklistItem(item.id);
                      }}
                      title="Delete custom item"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 4: WEATHER FORECAST
        ======================================================== */}
        {activeTab === 'weather' && (
          <div className="tool-content-card">
            <div className="tool-card-header">
              <div>
                <h3 className="tool-title">Destination Weather Forecast</h3>
                <p className="tool-subtitle">Check atmospheric conditions, temperature, and packing suggestions.</p>
              </div>

              <div className="flex gap-2">
                {['Hyderabad', 'Goa', 'Mumbai', 'Jaipur'].map((city) => (
                  <button
                    key={city}
                    type="button"
                    className={`filter-chip ${weatherCity === city ? 'active' : ''}`}
                    onClick={() => setWeatherCity(city)}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>

            {weatherLoading ? (
              <p className="py-12 text-center text-muted">Checking weather satellites...</p>
            ) : weatherData ? (
              <div className="weather-display-card mt-6">
                <div className="weather-main-row flex justify-between items-center flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    <div className="weather-icon-circle">
                      <Sun size={38} className="text-amber" />
                    </div>
                    <div>
                      <span className="text-xs text-muted uppercase font-bold tracking-wider">Current Weather in</span>
                      <h2 className="weather-city-name">{weatherData.city}</h2>
                      <span className="weather-condition-tag">{weatherData.condition}</span>
                    </div>
                  </div>

                  <div className="weather-temp-badge">
                    <span className="temp-number">{weatherData.temperature}°</span>
                    <span className="temp-unit">C</span>
                    <span className="feels-like-text">Feels like {weatherData.feelsLike}°C</span>
                  </div>
                </div>

                <div className="weather-details-three-grid mt-6">
                  <div className="weather-metric-box">
                    <Droplets size={18} className="text-blue" />
                    <div>
                      <span className="metric-label">Humidity</span>
                      <p className="metric-value">{weatherData.humidity}%</p>
                    </div>
                  </div>

                  <div className="weather-metric-box">
                    <Wind size={18} className="text-teal" />
                    <div>
                      <span className="metric-label">Wind Speed</span>
                      <p className="metric-value">{weatherData.windSpeed} km/h</p>
                    </div>
                  </div>

                  <div className="weather-metric-box">
                    <Sun size={18} className="text-amber" />
                    <div>
                      <span className="metric-label">UV Index</span>
                      <p className="metric-value">{weatherData.uvIndex}</p>
                    </div>
                  </div>
                </div>

                <div className="weather-travel-advice-box mt-6">
                  <strong className="text-navy">Travel Advice: </strong>
                  <span>{weatherData.tip}</span>
                </div>
              </div>
            ) : null}
          </div>
        )}

        {/* ========================================================
            TAB 5: PHRASEBOOK & TRANSLATOR
        ======================================================== */}
        {activeTab === 'translator' && (
          <div className="tool-content-card">
            <div className="tool-card-header">
              <div>
                <h3 className="tool-title">Regional Travel Phrasebook</h3>
                <p className="tool-subtitle">Essential conversational phrases translated into Hindi, Telugu, Marathi, and Konkani.</p>
              </div>
            </div>

            {/* Category Filter */}
            <div className="category-chips-scroll mt-4">
              {['GREETINGS', 'DIRECTIONS', 'FOOD', 'EMERGENCY'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`filter-chip ${phraseCategory === cat ? 'active' : ''}`}
                  onClick={() => setPhraseCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="phrasebook-cards-list mt-6">
              {filteredPhrases.map((phrase, idx) => (
                <div key={idx} className="phrase-card">
                  <div className="phrase-english-header">
                    <span className="phrase-en-label">English:</span>
                    <h4 className="phrase-en-text">{phrase.english}</h4>
                  </div>

                  <div className="phrase-translations-grid">
                    <div className="phrase-lang-col">
                      <span className="lang-label">Hindi:</span>
                      <p className="lang-text">{phrase.hindi}</p>
                    </div>
                    <div className="phrase-lang-col">
                      <span className="lang-label">Telugu (Hyderabad):</span>
                      <p className="lang-text">{phrase.telugu}</p>
                    </div>
                    <div className="phrase-lang-col">
                      <span className="lang-label">Marathi (Mumbai):</span>
                      <p className="lang-text">{phrase.marathi}</p>
                    </div>
                    <div className="phrase-lang-col">
                      <span className="lang-label">Konkani (Goa):</span>
                      <p className="lang-text">{phrase.konkani}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="translator-api-note mt-6">
              <span className="font-semibold text-navy">Note: </span>
              <span>
                Standard offline phrasebook with phonetic pronunciations. DeepL/Google Translation API keys can be configured via environment variables for live dynamic text translations.
              </span>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 6: TRAVEL SAFETY TIPS
        ======================================================== */}
        {activeTab === 'safety' && (
          <div className="tool-content-card">
            <div className="tool-card-header">
              <div>
                <h3 className="tool-title">Tourist Safety & Emergency Guide</h3>
                <p className="tool-subtitle">Essential verified travel guidance and emergency helplines in India.</p>
              </div>
            </div>

            {/* Emergency Contacts Banner */}
            <div className="emergency-numbers-grid mt-6">
              <div className="emergency-box bg-rose-soft">
                <PhoneCall size={20} className="text-rose" />
                <div>
                  <span className="emergency-title">National Emergency Hotline</span>
                  <p className="emergency-dial">Dial 112</p>
                </div>
              </div>

              <div className="emergency-box bg-purple-soft">
                <PhoneCall size={20} className="text-purple" />
                <div>
                  <span className="emergency-title">Women Helpline (All India)</span>
                  <p className="emergency-dial">Dial 1091</p>
                </div>
              </div>

              <div className="emergency-box bg-blue-soft">
                <PhoneCall size={20} className="text-blue" />
                <div>
                  <span className="emergency-title">Medical Ambulance Service</span>
                  <p className="emergency-dial">Dial 108</p>
                </div>
              </div>

              <div className="emergency-box bg-amber-soft">
                <PhoneCall size={20} className="text-amber" />
                <div>
                  <span className="emergency-title">Tourist Police Assistance</span>
                  <p className="emergency-dial">Dial 1363</p>
                </div>
              </div>
            </div>

            <div className="safety-tips-sections-grid mt-8">
              <div className="safety-tip-card">
                <h4 className="safety-card-heading">1. Personal Belongings & Cash</h4>
                <p className="safety-card-text">
                  Carry digital payments (UPI / cards) which are accepted nearly everywhere across Hyderabad, Mumbai, Goa, and Jaipur. Keep emergency cash in separate pockets and avoid flashing large banknotes at crowded street markets.
                </p>
              </div>

              <div className="safety-tip-card">
                <h4 className="safety-card-heading">2. Local Transport & Metered Cabs</h4>
                <p className="safety-card-text">
                  Use app-based rides (Uber, Ola, Rapido) or prepaid airport taxi booths to ensure transparent fares without bargaining hassles. In Mumbai, auto-rickshaws and black-and-yellow taxis operate strictly on meters.
                </p>
              </div>

              <div className="safety-tip-card">
                <h4 className="safety-card-heading">3. Safe Street Food & Hydration</h4>
                <p className="safety-card-text">
                  Enjoy famous street food at busy, high-turnover stalls where dishes are cooked piping hot right in front of you. Drink bottled or filtered RO water, and carry a reusable insulated water flask.
                </p>
              </div>

              <div className="safety-tip-card">
                <h4 className="safety-card-heading">4. Cultural Etiquette & Monuments</h4>
                <p className="safety-card-text">
                  Remove footwear before entering temples, mosques, and gurdwaras. Dress modestly with shoulders and knees covered at religious monuments. Always buy entry tickets from official counter booths or government web portals.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
