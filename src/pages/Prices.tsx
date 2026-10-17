import React, { useState, useMemo } from 'react';
import { generalPrices, touristTips, exchangeRates, formatPriceRange, type PriceCategory, type PriceItem } from '../lib/prices';
import { Search, ChevronDown, ChevronUp, DollarSign, Info, Lightbulb } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Prices() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['transport']));
  const [currency, setCurrency] = useState<'UZS' | 'USD' | 'EUR' | 'RUB'>('UZS');

  // Qidiruv bo'yicha filtrlash
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return generalPrices;

    const query = searchQuery.toLowerCase();
    return generalPrices
      .map(category => ({
        ...category,
        items: category.items.filter(item =>
          item.name.toLowerCase().includes(query) ||
          item.description?.toLowerCase().includes(query)
        )
      }))
      .filter(category => category.items.length > 0);
  }, [searchQuery]);

  // Kategoriyani kengaytirish/yig'ish
  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  // Barchasini kengaytirish/yig'ish
  const toggleAll = () => {
    if (expandedCategories.size === generalPrices.length) {
      setExpandedCategories(new Set());
    } else {
      setExpandedCategories(new Set(generalPrices.map(c => c.id)));
    }
  };

  // Narxni konvertatsiya qilish
  const convertPrice = (priceUZS: number): string => {
    if (currency === 'UZS') {
      return `${priceUZS.toLocaleString()} so'm`;
    }
    const rate = exchangeRates[currency];
    const converted = Math.round(priceUZS / rate);
    const symbols = { USD: '$', EUR: '€', RUB: '₽' };
    return `${converted.toLocaleString()} ${symbols[currency]}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Narxlar qo'llanmasi</h1>
          <p className="text-green-100 text-lg">O'zbekistonda sayohat narxlari 2024-2025</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Disclaimer */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-semibold mb-1">Muhim ma'lumot</p>
            <p>Narxlar 2024-2025 yillar uchun taxminiy ma'lumotlar. Aniq narxlar mavsum, joylashuv va boshqa omillarga qarab o'zgarishi mumkin.</p>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Nima qidiryapsiz? (masalan: taksi, osh, mehmonxona)"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Currency Selector */}
            <div className="flex items-center gap-2">
              <DollarSign className="text-gray-500" size={20} />
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as any)}
                className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="UZS">So'm (UZS)</option>
                <option value="USD">Dollar (USD)</option>
                <option value="EUR">Yevro (EUR)</option>
                <option value="RUB">Rubl (RUB)</option>
              </select>
            </div>

            {/* Toggle All */}
            <button
              onClick={toggleAll}
              className="px-4 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors font-medium"
            >
              {expandedCategories.size === generalPrices.length ? 'Barchasini yig\'ish' : 'Barchasini kengaytirish'}
            </button>
          </div>
        </div>

        {/* Price Categories */}
        <div className="space-y-4 mb-8">
          {filteredCategories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              isExpanded={expandedCategories.has(category.id)}
              onToggle={() => toggleCategory(category.id)}
              convertPrice={convertPrice}
            />
          ))}

          {filteredCategories.length === 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <Search size={48} className="mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Hech narsa topilmadi</h3>
              <p className="text-gray-600">Boshqa kalit so'z bilan qidirib ko'ring</p>
            </div>
          )}
        </div>

        {/* Tourist Tips */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl shadow-sm border border-amber-200 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Lightbulb className="w-6 h-6 text-amber-600" />
            Sayyohlar uchun foydali maslahatlar
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {touristTips.map((tip) => (
              <div key={tip.id} className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-3xl mb-2">{tip.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-1">{tip.title}</h3>
                <p className="text-sm text-gray-600">{tip.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Exchange Rates */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Valyuta kurslari (2024-2025)</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">1 USD</div>
              <div className="text-gray-600">≈ {exchangeRates.USD.toLocaleString()} so'm</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">1 EUR</div>
              <div className="text-gray-600">≈ {exchangeRates.EUR.toLocaleString()} so'm</div>
            </div>
            <div className="bg-red-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-red-600 mb-1">1 RUB</div>
              <div className="text-gray-600">≈ {exchangeRates.RUB.toLocaleString()} so'm</div>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-4 text-center">
            * Kurslar taxminiy. Aniq kursni bank yoki valyuta ayirboshlash punktlaridan so'rang.
          </p>
        </div>
      </div>
    </div>
  );
}

// Kategoriya kartochkasi
function CategoryCard({
  category,
  isExpanded,
  onToggle,
  convertPrice,
}: {
  category: PriceCategory;
  isExpanded: boolean;
  onToggle: () => void;
  convertPrice: (price: number) => string;
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-3xl">{category.icon}</span>
          <div className="text-left">
            <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
            <p className="text-sm text-gray-500">{category.description}</p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>

      {/* Content */}
      {isExpanded && (
        <div className="px-6 pb-6 border-t border-gray-100">
          <div className="space-y-3 mt-4">
            {category.items.map((item) => (
              <PriceItemCard key={item.id} item={item} convertPrice={convertPrice} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Narx kartochkasi
function PriceItemCard({
  item,
  convertPrice,
}: {
  item: PriceItem;
  convertPrice: (price: number) => string;
}) {
  return (
    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      <span className="text-2xl flex-shrink-0">{item.icon}</span>
      <div className="flex-1">
        <div className="flex items-start justify-between gap-4 mb-1">
          <div>
            <h4 className="font-semibold text-gray-900">{item.name}</h4>
            {item.description && (
              <p className="text-sm text-gray-600">{item.description}</p>
            )}
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-lg font-bold text-green-600">
              {convertPrice(item.price.min)}
              {item.price.min !== item.price.max && (
                <> - {convertPrice(item.price.max)}</>
              )}
            </div>
            {item.price.note && (
              <div className="text-xs text-gray-500">{item.price.note}</div>
            )}
          </div>
        </div>
        {item.tip && (
          <div className="mt-2 flex items-start gap-2 text-sm text-blue-700 bg-blue-50 rounded p-2">
            <Lightbulb size={14} className="flex-shrink-0 mt-0.5" />
            <span>{item.tip}</span>
          </div>
        )}
      </div>
    </div>
  );
}
