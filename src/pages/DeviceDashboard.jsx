import React, { useState, useMemo, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
} from "@/components/ui/table";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Cell,
} from "recharts";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  CircleMarker,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

/**
 * DeviceDashboard
 * Props:
 *  - searchTerm (string) : global search from App.jsx
 */
export default function DeviceDashboard({ searchTerm = "" }) {
  const [filters, setFilters] = useState({
    startDate: "2025-10-01",
    endDate: "2025-11-30",
    region: "",
    office: "",
    status: "",
  });

  const [pulse, setPulse] = useState(false);
  const [blinkCity, setBlinkCity] = useState("");
  const [dropdownVisible, setDropdownVisible] = useState({
    region: false,
    office: false,
    status: false,
  });

  // pagination
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  // === WILAYAH & WARNA PER PULAU (map to marker color names available) ===
  const islandColors = {
    Sumatra: "blue",
    Jawa: "green",
    Kalimantan: "yellow",
    Sulawesi: "violet",
    BaliNTT: "orange",
    Maluku: "red",
    Papua: "black",
  };

  // === REGION DATA (33 kota besar sample) ===
  // You can easily add more city objects here to reach 40+.
  const regionData = [
    // SUMATRA
    { name: "Banda Aceh", coords: [5.5483, 95.3238], island: "Sumatra" },
    { name: "Medan", coords: [3.5952, 98.6722], island: "Sumatra" },
    { name: "Padang", coords: [-0.9471, 100.4172], island: "Sumatra" },
    { name: "Pekanbaru", coords: [0.5333, 101.45], island: "Sumatra" },
    { name: "Jambi", coords: [-1.5967, 103.615], island: "Sumatra" },
    { name: "Palembang", coords: [-2.9909, 104.7566], island: "Sumatra" },
    { name: "Bengkulu", coords: [-3.7956, 102.26], island: "Sumatra" },
    { name: "Pangkal Pinang", coords: [-2.1291, 106.1099], island: "Sumatra" },
    { name: "Tanjung Pinang", coords: [0.9171, 104.4469], island: "Sumatra" },

    // JAWA
    { name: "Jakarta", coords: [-6.2088, 106.8456], island: "Jawa" },
    { name: "Bogor", coords: [-6.595, 106.816], island: "Jawa" },
    { name: "Bekasi", coords: [-6.2333, 107.0], island: "Jawa" },
    { name: "Depok", coords: [-6.4025, 106.7942], island: "Jawa" },
    { name: "Tangerang", coords: [-6.1783, 106.63], island: "Jawa" },
    { name: "Bandung", coords: [-6.9147, 107.6098], island: "Jawa" },
    { name: "Cirebon", coords: [-6.7333, 108.5667], island: "Jawa" },
    { name: "Semarang", coords: [-6.9667, 110.4167], island: "Jawa" },
    { name: "Yogyakarta", coords: [-7.8014, 110.3647], island: "Jawa" },
    { name: "Solo", coords: [-7.5667, 110.8167], island: "Jawa" },
    { name: "Surabaya", coords: [-7.2575, 112.7521], island: "Jawa" },

    // KALIMANTAN
    { name: "Pontianak", coords: [-0.0227, 109.3306], island: "Kalimantan" },
    { name: "Palangkaraya", coords: [-2.21, 113.92], island: "Kalimantan" },
    { name: "Banjarmasin", coords: [-3.3167, 114.5833], island: "Kalimantan" },
    { name: "Balikpapan", coords: [-1.2379, 116.852], island: "Kalimantan" },
    { name: "Samarinda", coords: [-0.5022, 117.1536], island: "Kalimantan" },
    { name: "Tanjung Selor", coords: [2.838, 117.375], island: "Kalimantan" },

    // SULAWESI
    { name: "Manado", coords: [1.4748, 124.8421], island: "Sulawesi" },
    { name: "Gorontalo", coords: [0.541, 123.056], island: "Sulawesi" },
    { name: "Palu", coords: [-0.9, 119.87], island: "Sulawesi" },
    { name: "Makassar", coords: [-5.1477, 119.4327], island: "Sulawesi" },
    { name: "Kendari", coords: [-3.9985, 122.512], island: "Sulawesi" },

    // BALI & NUSA TENGGARA
    { name: "Denpasar", coords: [-8.65, 115.2167], island: "BaliNTT" },
    { name: "Mataram", coords: [-8.5833, 116.1167], island: "BaliNTT" },
    { name: "Kupang", coords: [-10.1772, 123.607], island: "BaliNTT" },

    // MALUKU
    { name: "Ambon", coords: [-3.6956, 128.1814], island: "Maluku" },
    { name: "Ternate", coords: [0.793, 127.384], island: "Maluku" },

    // PAPUA
    { name: "Jayapura", coords: [-2.5916, 140.6689], island: "Papua" },
    { name: "Merauke", coords: [-8.493, 140.404], island: "Papua" },
    { name: "Sorong", coords: [-0.8762, 131.2558], island: "Papua" },
  ];

  // === ICON CREATOR (colored marker icons from GitHub raw) ===
  const createColoredIcon = (colorName) =>
    new L.Icon({
      iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${colorName}.png`,
      shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

  const regions = regionData.map((r) => r.name);

  // offices list (sample)
  const offices = [
    "Polda Aceh",
    "Polda Jabar",
    "Polda Jatim",
    "Polda Jateng",
    "Polda DIY",
    "Polda Sumut",
    "Polda Sumbar",
    "Polda Riau",
    "Polda Sumsel",
    "Polda Metro Jaya",
    "Polda Kalbar",
    "Polda Kalsel",
    "Polda Kaltim",
    "Polda Kaltara",
    "Polda Sulut",
    "Polda Sulteng",
    "Polda Sulsel",
    "Polda Sultra",
    "Polda Bali",
    "Polda NTT",
    "Polda Maluku",
    "Polda Malut",
    "Polda Papua",
  ];

  const statuses = ["Yes", "No"];

  // === DUMMY DEVICES GENERATED FROM regionData (one device per city sample) ===
  const allDevices = regionData.map((r, i) => ({
    id: `${i + 1}`.padStart(3, "0"),
    device: `Mambis_A-${(i + 1).toString().padStart(3, "0")}`,
    office: offices[i % offices.length],
    regional: r.name,
    active: i % 4 === 0 ? "No" : "Yes", // some inactive
    time: `2025-10-${(i % 30 + 1).toString().padStart(2, "0")}`,
  }));

  // === Utility: highlight search term inside text (returns HTML string) ===
  const highlightText = (text) => {
    if (!searchTerm) return text;
    const escaped = String(searchTerm).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(${escaped})`, "gi");
    return String(text).replace(regex, (m) => `<mark class="bg-yellow-200">${m}</mark>`);
  };

  // === FILTERED DEVICES (include searchTerm matching device/office/regional) ===
  const filteredDevices = useMemo(() => {
    const start = new Date(filters.startDate);
    const end = new Date(filters.endDate);

    return allDevices.filter((d) => {
      const date = new Date(d.time);

      const matchesDate = date >= start && date <= end;
      const matchesRegion =
        !filters.region ||
        d.regional.toLowerCase().includes(filters.region.toLowerCase());
      const matchesOffice =
        !filters.office ||
        d.office.toLowerCase().includes(filters.office.toLowerCase());
      const matchesStatus =
        !filters.status ||
        d.active.toLowerCase().includes(filters.status.toLowerCase());

      const matchesSearch =
        !searchTerm ||
        d.device.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.office.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.regional.toLowerCase().includes(searchTerm.toLowerCase());

      return (
        matchesDate &&
        matchesRegion &&
        matchesOffice &&
        matchesStatus &&
        matchesSearch
      );
    });
  }, [filters, searchTerm, allDevices]);

  // === CHART DATA derived from filteredDevices ===
  const chartData = useMemo(() => {
    const grouped = {};
    filteredDevices.forEach((d) => {
      grouped[d.regional] = (grouped[d.regional] || 0) + 1;
    });
    return Object.entries(grouped).map(([Regional_Name, Total_Devices]) => ({
      Regional_Name,
      Total_Devices,
    }));
  }, [filteredDevices]);

  // Map focus: if filters.region set => focus that, else if searchTerm exactly matches a city => focus that
  const focusCity = useMemo(() => {
    if (filters.region) return filters.region;
    if (!searchTerm) return "";
    const exact = regionData.find(
      (r) => r.name.toLowerCase() === searchTerm.toLowerCase()
    );
    return exact ? exact.name : "";
  }, [filters.region, searchTerm]);

  // MapUpdater: flyTo any focusCity changes and trigger blinkCity
  const MapUpdater = ({ focus }) => {
    const map = useMap();
    useEffect(() => {
      if (!focus) return;
      const match = regionData.find((r) => r.name.toLowerCase() === focus.toLowerCase());
      if (match) {
        map.flyTo(match.coords, 7, { duration: 1.2 });
        setBlinkCity(match.name);
        const t = setTimeout(() => setBlinkCity(""), 2200);
        return () => clearTimeout(t);
      }
    }, [focus, map]);
    return null;
  };

  const total = filteredDevices.length;
  const active = filteredDevices.filter((d) => d.active === "Yes").length;
  const inactive = filteredDevices.filter((d) => d.active === "No").length;

  const chartControls = useAnimation();
  const mapControls = useAnimation();

  useEffect(() => {
    const handleScroll = () => {
      const chart = document.getElementById("chart-section");
      const map = document.getElementById("map-section");
      const chartTop = chart?.getBoundingClientRect().top;
      const mapTop = map?.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      if (chartTop && chartTop < windowHeight - 100) chartControls.start("visible");
      if (mapTop && mapTop < windowHeight - 100) mapControls.start("visible");
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [chartControls, mapControls]);

  useEffect(() => {
    setPulse(true);
    const timeout = setTimeout(() => setPulse(false), 600);
    return () => clearTimeout(timeout);
  }, [filters.status]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setDropdownVisible((prev) => ({ ...prev, [key]: false }));
    setPage(1); // reset pagination on filter change
  };

  // === Pagination logic ===
  const totalPages = Math.max(1, Math.ceil(filteredDevices.length / perPage));
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  const paginatedDevices = useMemo(() => {
    const start = (page - 1) * perPage;
    return filteredDevices.slice(start, start + perPage);
  }, [filteredDevices, page, perPage]);

  // Visible cities for the map: only show cities that appear in filteredDevices
  const visibleCities = useMemo(() => {
    const s = new Set(filteredDevices.map((d) => d.regional));
    return s;
  }, [filteredDevices]);

  // Small inline styles for blink effect overlay (works without editing external CSS)
  const blinkStyle = `
    .leaflet-container .blink-circle {
      animation: blinkScale 1s infinite;
    }
    @keyframes blinkScale {
      0% { transform: translate(-50%, -50%) scale(1); opacity: 0.9; }
      50% { transform: translate(-50%, -50%) scale(1.6); opacity: 0.35;}
      100% { transform: translate(-50%, -50%) scale(1); opacity: 0.9; }
    }
  `;

  return (
    <div className="w-full h-full bg-white dark:bg-gray-950 transition-colors duration-500">
      {/* inline style tag for blink animation */}
      <style>{blinkStyle}</style>

      <div className="max-w-[1900px] mx-auto p-6 grid gap-6">
        {/* === STATUS + CHART + MAP === */}
        <div className="grid grid-cols-1 xl:grid-cols-[1.35fr_2.5fr] gap-6">
          {/* LEFT: STATUS + CHART */}
          <div className="flex flex-col gap-4">
            {/* STATUS CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="text-center shadow-md hover:scale-[1.02] transition">
                <CardHeader>
                  <CardTitle className="text-4xl font-bold text-blue-600">{total}</CardTitle>
                  <p className="text-gray-500 text-sm">Total Devices</p>
                </CardHeader>
              </Card>
              <Card className="text-center bg-green-50 hover:shadow-green-300 transition">
                <CardHeader>
                  <CardTitle className="text-4xl font-bold text-green-600">{active}</CardTitle>
                  <p className="text-gray-500 text-sm">Active Devices</p>
                </CardHeader>
              </Card>
              <Card className="text-center bg-red-50 hover:shadow-red-300 transition">
                <CardHeader>
                  <CardTitle className="text-4xl font-bold text-red-600">{inactive}</CardTitle>
                  <p className="text-gray-500 text-sm">Inactive Devices</p>
                </CardHeader>
              </Card>
            </div>

            {/* CHART */}
            <motion.div
              id="chart-section"
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.9 } },
              }}
              initial="hidden"
              animate={chartControls}
              whileHover={{
                boxShadow: "0 0 20px rgba(59,130,246,0.4)",
                scale: 1.01,
              }}
            >
              <Card className="shadow-md border">
                <CardHeader>
                  <CardTitle>Total Devices by Regional</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                      <XAxis dataKey="Regional_Name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="Total_Devices">
                        {chartData.map((entry, i) => (
                          <Cell
                            key={i}
                            fill={
                              filters.status.toLowerCase() === "no"
                                ? "#ef4444"
                                : filters.status.toLowerCase() === "yes"
                                ? "#22c55e"
                                : "#3b82f6"
                            }
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* RIGHT: MAP (bigger) */}
          <motion.div
            id="map-section"
            variants={{
              hidden: { opacity: 0, y: 40 },
              visible: { opacity: 1, y: 0, transition: { duration: 1 } },
            }}
            initial="hidden"
            animate={mapControls}
            className={`xl:row-span-1 relative ${pulse ? "animate-pulse" : ""}`}
          >
            <Card className="shadow-lg border h-full flex flex-col">
              <CardHeader className="flex flex-wrap justify-between items-center gap-2">
                <div className="flex items-center gap-2">
                  <CardTitle>Active / Inactive Map</CardTitle>
                  <button
                    onClick={() =>
                      setFilters((f) => ({ ...f, status: f.status === "Yes" ? "No" : "Yes" }))
                    }
                    className={`px-4 py-2 rounded-md text-white font-medium ${
                      filters.status === "Yes" ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"
                    }`}
                  >
                    {filters.status === "Yes" ? "🟢 Active" : "🔴 Inactive"}
                  </button>
                </div>

                {/* MAP FILTER BUTTONS */}
                <div className="flex gap-2">
                  <button
                    onClick={() => { setFilters((f) => ({ ...f, status: "" })); setPage(1); }}
                    className="px-3 py-1 border rounded hover:bg-gray-100 text-gray-700 text-xs"
                  >
                    All Activities
                  </button>
                  <button
                    onClick={() => { setFilters((f) => ({ ...f, status: "Yes" })); setPage(1); }}
                    className="px-3 py-1 border rounded text-green-600 hover:bg-green-50 text-xs"
                  >
                    Active Only
                  </button>
                  <button
                    onClick={() => { setFilters((f) => ({ ...f, status: "No" })); setPage(1); }}
                    className="px-3 py-1 border rounded text-red-600 hover:bg-red-50 text-xs"
                  >
                    Inactive Only
                  </button>
                </div>
              </CardHeader>

              <CardContent className="flex-1 h-[640px] p-0 relative">
                <MapContainer center={[-2, 118]} zoom={5} className="h-full w-full rounded-b-lg transition-all duration-700">
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                  {/* SHOW only cities that appear in filteredDevices (so chart/table/map stay in sync) */}
                  {regionData
                    .filter((r) => visibleCities.has(r.name))
                    .map((r) => {
                      const isBlink = blinkCity === r.name;
                      const colorName = islandColors[r.island] || "blue";
                      const icon = createColoredIcon(colorName);

                      return (
                        <React.Fragment key={r.name}>
                          {/* main marker */}
                          <Marker position={r.coords} icon={icon} opacity={isBlink ? 1 : 0.9}>
                            <Popup>
                              <b>{r.name}</b> <br />
                              Pulau: {r.island}
                              <br />
                              {/* show counts from filteredDevices */}
                              <span>
                                Count: {filteredDevices.filter((d) => d.regional === r.name).length}
                              </span>
                            </Popup>
                          </Marker>

                          {/* blinking overlay: CircleMarker only for the focused city */}
                          {isBlink && (
                            <CircleMarker
                              center={r.coords}
                              radius={16}
                              pathOptions={{ color: "#ffffff", fillColor: "#ffd54f", fillOpacity: 0.45, weight: 0 }}
                              className="blink-circle"
                            />
                          )}
                        </React.Fragment>
                      );
                    })}

                  {/* Fly to focus city when user searches exact city or uses region filter */}
                  <MapUpdater focus={focusCity} />
                </MapContainer>

                {/* Legend */}
                <div className="absolute bottom-3 right-3 bg-white/90 rounded-md shadow p-2 text-xs">
                  <p className="font-semibold mb-1 text-gray-700">Legend:</p>
                  {Object.entries(islandColors).map(([island, color]) => (
                    <div key={island} className="flex items-center gap-2">
                      <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: color }}></span>
                      <span>{island}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* === TABLE + FILTER === */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4">
          {/* TABLE */}
          <Card>
            <CardHeader className="flex items-center justify-between">
              <CardTitle>Devices Activity</CardTitle>
              {/* Pagination controls top-right */}
              <div className="flex items-center gap-2">
                <div className="text-xs text-gray-600 mr-2">Per page:</div>
                <select
                  value={perPage}
                  onChange={(e) => { setPerPage(Number(e.target.value)); setPage(1); }}
                  className="border px-2 py-1 rounded"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                </select>
              </div>
            </CardHeader>

            <CardContent className="overflow-auto max-h-[400px]">
              <Table className="text-xs">
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Device</TableHead>
                    <TableHead>Office</TableHead>
                    <TableHead>Region</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedDevices.map((d) => (
                    <TableRow key={d.id}>
                      <TableCell>{d.id}</TableCell>

                      {/* highlighted fields using dangerouslySetInnerHTML */}
                      <TableCell dangerouslySetInnerHTML={{ __html: highlightText(d.device) }} />
                      <TableCell dangerouslySetInnerHTML={{ __html: highlightText(d.office) }} />
                      <TableCell
                        className="cursor-pointer text-blue-600 hover:underline"
                        onClick={() => handleFilterChange("region", d.regional)}
                        dangerouslySetInnerHTML={{ __html: highlightText(d.regional) }}
                      />

                      <TableCell className={`font-bold ${d.active === "Yes" ? "text-green-600" : "text-red-600"}`}>
                        {d.active}
                      </TableCell>
                      <TableCell>{d.time}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination UI */}
              <div className="flex items-center justify-between mt-3">
                <div className="text-xs text-gray-600">
                  Showing {(page - 1) * perPage + 1} - {Math.min(page * perPage, filteredDevices.length)} of {filteredDevices.length}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="px-3 py-1 border rounded disabled:opacity-50 text-sm"
                  >
                    Prev
                  </button>
                  <div className="text-sm px-2">{page} / {totalPages}</div>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                    className="px-3 py-1 border rounded disabled:opacity-50 text-sm"
                  >
                    Next
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* FILTER */}
          <Card>
            <CardHeader><CardTitle>Filter</CardTitle></CardHeader>
            <CardContent className="flex flex-col gap-4 text-sm">
              <div>
                <label>Date Range:</label>
                <div className="flex gap-2 mt-1">
                  <input
                    type="date"
                    value={filters.startDate}
                    onChange={(e) => handleFilterChange("startDate", e.target.value)}
                    className="border p-2 rounded-md w-full"
                  />
                  <input
                    type="date"
                    value={filters.endDate}
                    onChange={(e) => handleFilterChange("endDate", e.target.value)}
                    className="border p-2 rounded-md w-full"
                  />
                </div>
              </div>

              {["region", "office", "status"].map((field) => (
                <div key={field} className="relative">
                  <label className="capitalize">{field}:</label>
                  <input
                    type="text"
                    value={filters[field]}
                    onChange={(e) => handleFilterChange(field, e.target.value)}
                    onFocus={() => setDropdownVisible((p) => ({ ...p, [field]: true }))}
                    placeholder={`Select ${field}`}
                    className="border p-2 rounded-md w-full"
                  />
                  {dropdownVisible[field] && (
                    <div className="absolute bg-white border rounded-md mt-1 max-h-40 overflow-auto z-10 w-full shadow-md">
                      {(field === "region"
                        ? regionData.map((r) => r.name)
                        : field === "office"
                          ? offices
                          : statuses
                      )
                        .filter((opt) => opt.toLowerCase().includes(filters[field].toLowerCase()))
                        .map((opt) => (
                          <div
                            key={opt}
                            onClick={() => handleFilterChange(field, opt)}
                            className="p-2 hover:bg-blue-50 cursor-pointer"
                          >
                            {opt}
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
