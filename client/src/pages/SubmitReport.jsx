import React, { useState, useEffect } from "react";
import PageLayout from "../layout/PageLayout";
import {
  MapPin,
  AlertCircle,
  FileText,
  Camera,
  Upload,
  Loader2,
  AlertTriangle,
  Info,
  CheckCircle,
  Building,
  Map,
} from "lucide-react";
import { useIssuesStore } from "../store/issueStore";
import { useGeolocation } from "../hook/useGeolocation";
import { useReportStore } from "../store/reportStore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// Nigerian States and LGAs Data
const nigerian_states = {
  "Abia": [
    "Aba North", "Aba South", "Arochukwu", "Bende", "Ikwuano",
    "Isiala-Ngwa North", "Isiala-Ngwa South", "Isuikwato", "Obi Nwa",
    "Ohafia", "Osisioma", "Ngwa", "Ugwunagbo", "Ukwa East", "Ukwa West",
    "Umuahia North", "Umuahia South", "Umu-Neochi"
  ],
  "Adamawa": [
    "Demsa", "Fufore", "Ganaye", "Gireri", "Gombi", "Guyuk", "Hong",
    "Jada", "Lamurde", "Madagali", "Maiha", "Mayo-Belwa", "Michika",
    "Mubi North", "Mubi South", "Numan", "Shelleng", "Song", "Toungo",
    "Yola North", "Yola South"
  ],
  "Anambra": [
    "Aguata", "Anambra East", "Anambra West", "Anaocha", "Awka North",
    "Awka South", "Ayamelum", "Dunukofia", "Ekwusigo", "Idemili North",
    "Idemili south", "Ihiala", "Njikoka", "Nnewi North", "Nnewi South",
    "Ogbaru", "Onitsha North", "Onitsha South", "Orumba North",
    "Orumba South", "Oyi"
  ],
  "Akwa Ibom": [
    "Abak", "Eastern Obolo", "Eket", "Esit Eket", "Essien Udim",
    "Etim Ekpo", "Etinan", "Ibeno", "Ibesikpo Asutan", "Ibiono Ibom",
    "Ika", "Ikono", "Ikot Abasi", "Ikot Ekpene", "Ini", "Itu", "Mbo",
    "Mkpat Enin", "Nsit Atai", "Nsit Ibom", "Nsit Ubium", "Obot Akara",
    "Okobo", "Onna", "Oron", "Oruk Anam", "Udung Uko", "Ukanafun",
    "Uruan", "Urue-Offong/Oruko", "Uyo"
  ],
  "Bauchi": [
    "Alkaleri", "Bauchi", "Bogoro", "Damban", "Darazo", "Dass",
    "Ganjuwa", "Giade", "Itas/Gadau", "Jama'are", "Katagum", "Kirfi",
    "Misau", "Ningi", "Shira", "Tafawa-Balewa", "Toro", "Warji", "Zaki"
  ],
  "Bayelsa": [
    "Brass", "Ekeremor", "Kolokuma/Opokuma", "Nembe", "Ogbia", "Sagbama",
    "Southern Jaw", "Yenegoa"
  ],
  "Benue": [
    "Ado", "Agatu", "Apa", "Buruku", "Gboko", "Guma", "Gwer East",
    "Gwer West", "Katsina-Ala", "Konshisha", "Kwande", "Logo", "Makurdi",
    "Obi", "Ogbadibo", "Oju", "Okpokwu", "Ohimini", "Oturkpo", "Tarka",
    "Ukum", "Ushongo", "Vandeikya"
  ],
  "Borno": [
    "Abadam", "Askira/Uba", "Bama", "Bayo", "Biu", "Chibok", "Damboa",
    "Dikwa", "Gubio", "Guzamala", "Gwoza", "Hawul", "Jere", "Kaga",
    "Kala/Balge", "Konduga", "Kukawa", "Kwaya Kusar", "Mafa", "Magumeri",
    "Maiduguri", "Marte", "Mobbar", "Monguno", "Ngala", "Nganzai", "Shani"
  ],
  "Cross River": [
    "Akpabuyo", "Odukpani", "Akamkpa", "Biase", "Abi", "Ikom", "Yarkur",
    "Odubra", "Boki", "Ogoja", "Yala", "Obanliku", "Obudu", "Calabar South",
    "Etung", "Bekwara", "Bakassi", "Calabar Municipality"
  ],
  "Delta": [
    "Oshimili", "Aniocha", "Aniocha South", "Ika South", "Ika North-East",
    "Ndokwa West", "Ndokwa East", "Isoko south", "Isoko North", "Bomadi",
    "Burutu", "Ughelli South", "Ughelli North", "Ethiope West", "Ethiope East",
    "Sapele", "Okpe", "Warri North", "Warri South", "Uvwie", "Udu",
    "Warri Central", "Ukwani", "Oshimili North", "Patani"
  ],
  "Ebonyi": [
    "Edda", "Afikpo", "Onicha", "Ohaozara", "Abakaliki", "Ishielu", "lkwo",
    "Ezza", "Ezza South", "Ohaukwu", "Ebonyi", "Ivo"
  ],
  "Enugu": [
    "Enugu South,", "Igbo-Eze South", "Enugu North", "Nkanu", "Udi Agwu",
    "Oji-River", "Ezeagu", "IgboEze North", "Isi-Uzo", "Nsukka", "Igbo-Ekiti",
    "Uzo-Uwani", "Enugu Eas", "Aninri", "Nkanu East", "Udenu."
  ],
  "Edo": [
    "Esan North-East", "Esan Central", "Esan West", "Egor", "Ukpoba",
    "Central", "Etsako Central", "Igueben", "Oredo", "Ovia SouthWest",
    "Ovia South-East", "Orhionwon", "Uhunmwonde", "Etsako East", "Esan South-East"
  ],
  "Ekiti": [
    "Ado", "Ekiti-East", "Ekiti-West", "Emure/Ise/Orun", "Ekiti South-West",
    "Ikere", "Irepodun", "Ijero,", "Ido/Osi", "Oye", "Ikole", "Moba",
    "Gbonyin", "Efon", "Ise/Orun", "Ilejemeje."
  ],
  "FCT": [
    "Abaji", "Abuja Municipal", "Bwari", "Gwagwalada", "Kuje", "Kwali"
  ],
  "Gombe": [
    "Akko", "Balanga", "Billiri", "Dukku", "Kaltungo", "Kwami", "Shomgom",
    "Funakaye", "Gombe", "Nafada/Bajoga", "Yamaltu/Delta."
  ],
  "Imo": [
    "Aboh-Mbaise", "Ahiazu-Mbaise", "Ehime-Mbano", "Ezinihitte", "Ideato North",
    "Ideato South", "Ihitte/Uboma", "Ikeduru", "Isiala Mbano", "Isu",
    "Mbaitoli", "Mbaitoli", "Ngor-Okpala", "Njaba", "Nwangele", "Nkwerre",
    "Obowo", "Oguta", "Ohaji/Egbema", "Okigwe", "Orlu", "Orsu", "Oru East",
    "Oru West", "Owerri-Municipal", "Owerri North", "Owerri West"
  ],
  "Jigawa": [
    "Auyo", "Babura", "Birni Kudu", "Biriniwa", "Buji", "Dutse", "Gagarawa",
    "Garki", "Gumel", "Guri", "Gwaram", "Gwiwa", "Hadejia", "Jahun",
    "Kafin Hausa", "Kaugama Kazaure", "Kiri Kasamma", "Kiyawa", "Maigatari",
    "Malam Madori", "Miga", "Ringim", "Roni", "Sule-Tankarkar", "Taura", "Yankwashi"
  ],
  "Kaduna": [
    "Birni-Gwari", "Chikun", "Giwa", "Igabi", "Ikara", "jaba", "Jema'a",
    "Kachia", "Kaduna North", "Kaduna South", "Kagarko", "Kajuru", "Kaura",
    "Kauru", "Kubau", "Kudan", "Lere", "Makarfi", "Sabon-Gari", "Sanga",
    "Soba", "Zango-Kataf", "Zaria"
  ],
  "Kano": [
    "Ajingi", "Albasu", "Bagwai", "Bebeji", "Bichi", "Bunkure", "Dala",
    "Dambatta", "Dawakin Kudu", "Dawakin Tofa", "Doguwa", "Fagge", "Gabasawa",
    "Garko", "Garum Mallam", "Gaya", "Gezawa", "Gwale", "Gwarzo", "Kabo",
    "Kano Municipal", "Karaye", "Kibiya", "Kiru", "kumbotso", "Ghari",
    "Kura", "Madobi", "Makoda", "Minjibir", "Nasarawa", "Rano", "Rimin Gado",
    "Rogo", "Shanono", "Sumaila", "Takali", "Tarauni", "Tofa", "Tsanyawa",
    "Tudun Wada", "Ungogo", "Warawa", "Wudil"
  ],
  "Katsina": [
    "Bakori", "Batagarawa", "Batsari", "Baure", "Bindawa", "Charanchi",
    "Dandume", "Danja", "Dan Musa", "Daura", "Dutsi", "Dutsin-Ma", "Faskari",
    "Funtua", "Ingawa", "Jibia", "Kafur", "Kaita", "Kankara", "Kankia",
    "Katsina", "Kurfi", "Kusada", "Mai'Adua", "Malumfashi", "Mani", "Mashi",
    "Matazuu", "Musawa", "Rimi", "Sabuwa", "Safana", "Sandamu", "Zango"
  ],
  "Kebbi": [
    "Aleiro", "Arewa-Dandi", "Argungu", "Augie", "Bagudo", "Birnin Kebbi",
    "Bunza", "Dandi", "Fakai", "Gwandu", "Jega", "Kalgo", "Koko/Besse",
    "Maiyama", "Ngaski", "Sakaba", "Shanga", "Suru", "Wasagu/Danko", "Yauri", "Zuru"
  ],
  "Kogi": [
    "Adavi", "Ajaokuta", "Ankpa", "Bassa", "Dekina", "Ibaji", "Idah",
    "Igalamela-Odolu", "Ijumu", "Kabba/Bunu", "Kogi", "Lokoja", "Mopa-Muro",
    "Ofu", "Ogori/Mangongo", "Okehi", "Okene", "Olamabolo", "Omala",
    "Yagba East", "Yagba West"
  ],
  "Kwara": [
    "Asa", "Baruten", "Edu", "Ekiti", "Ifelodun", "Ilorin East", "Ilorin West",
    "Irepodun", "Isin", "Kaiama", "Moro", "Offa", "Oke-Ero", "Oyun", "Pategi"
  ],
  "Lagos": [
    "Agege", "Ajeromi-Ifelodun", "Alimosho", "Amuwo-Odofin", "Apapa", "Badagry",
    "Epe", "Eti-Osa", "Ibeju/Lekki", "Ifako-Ijaye", "Ikeja", "Ikorodu",
    "Kosofe", "Lagos Island", "Lagos Mainland", "Mushin", "Ojo", "Oshodi-Isolo",
    "Shomolu", "Surulere"
  ],
  "Nasarawa": [
    "Akwanga", "Awe", "Doma", "Karu", "Keana", "Keffi", "Kokona", "Lafia",
    "Nasarawa", "Nasarawa-Eggon", "Obi", "Toto", "Wamba"
  ],
  "Niger": [
    "Agaie", "Agwara", "Bida", "Borgu", "Bosso", "Chanchaga", "Edati", "Gbako",
    "Gurara", "Katcha", "Kontagora", "Lapai", "Lavun", "Magama", "Mariga",
    "Mashegu", "Mokwa", "Muya", "Pailoro", "Rafi", "Rijau", "Shiroro",
    "Suleja", "Tafa", "Wushishi"
  ],
  "Ogun": [
    "Abeokuta North", "Abeokuta South", "Ado-Odo/Ota", "Yewa North", "Yewa South",
    "Ewekoro", "Ifo", "Ijebu East", "Ijebu North", "Ijebu North East",
    "Ijebu Ode", "Ikenne", "Imeko-Afon", "Ipokia", "Obafemi-Owode",
    "Ogun Waterside", "Odeda", "Odogbolu", "Remo North", "Shagamu"
  ],
  "Ondo": [
    "Akoko North East", "Akoko North West", "Akoko South Akure East",
    "Akoko South West", "Akure North", "Akure South", "Ese-Odo", "Idanre",
    "Ifedore", "Ilaje", "Ile-Oluji Okeigbo", "Irele", "Odigbo", "Okitipupa",
    "Ondo East", "Ondo West", "Ose", "Owo"
  ],
  "Osun": [
    "Aiyedade", "Aiyedire", "Atakumosa East", "Atakumosa West", "Boluwaduro",
    "Boripe", "Ede North", "Ede South", "Egbedore", "Ejigbo", "Ife Central",
    "Ife East", "Ife North", "Ife South", "Ifedayo", "Ifelodun", "Ila",
    "Ilesha East", "Ilesha West", "Irepodun", "Irewole", "Isokan", "Iwo",
    "Obokun", "Odo-Otin", "Ola-Oluwa", "Olorunda", "Oriade", "Orolu", "Osogbo"
  ],
  "Oyo": [
    "Afijio", "Akinyele", "Atiba", "Atisbo", "Egbeda", "Ibadan Central",
    "Ibadan North", "Ibadan North West", "Ibadan South East", "Ibadan South West",
    "Ibarapa Central", "Ibarapa East", "Ibarapa North", "Ido", "Irepo",
    "Iseyin", "Itesiwaju", "Iwajowa", "Kajola", "Lagelu Ogbomosho North",
    "Ogbomosho South", "Ogo Oluwa", "Olorunsogo", "Oluyole", "Ona-Ara",
    "Orelope", "Ori Ire", "Oyo East", "Oyo West", "Saki East", "Saki West", "Surulere"
  ],
  "Plateau": [
    "Barikin Ladi", "Bassa", "Bokkos", "Jos East", "Jos North", "Jos South",
    "Kanam", "Kanke", "Langtang North", "Langtang South", "Mangu", "Mikang",
    "Pankshin", "Qua'an Pan", "Riyom", "Shendam", "Wase"
  ],
  "Rivers": [
    "Abua/Odual", "Ahoada East", "Ahoada West", "Akuku Toru", "Andoni",
    "Asari-Toru", "Bonny", "Degema", "Emohua", "Eleme", "Etche", "Gokana",
    "Ikwerre", "Khana", "Obio/Akpor", "Ogba/Egbema/Ndoni", "Ogu/Bolo",
    "Okrika", "Omumma", "Opobo/Nkoro", "Oyigbo", "Port-Harcourt", "Tai"
  ],
  "Sokoto": [
    "Binji", "Bodinga", "Dange-shnsi", "Gada", "Goronyo", "Gudu", "Gawabawa",
    "Illela", "Isa", "Kware", "kebbe", "Rabah", "Sabon birni", "Shagari",
    "Silame", "Sokoto North", "Sokoto South", "Tambuwal", "Tqngaza", "Tureta",
    "Wamako", "Wurno", "Yabo"
  ],
  "Taraba": [
    "Ardo-kola", "Bali", "Donga", "Gashaka", "Cassol", "Ibi", "Jalingo",
    "Karin-Lamido", "Kurmi", "Lau", "Sardauna", "Takum", "Ussa", "Wukari",
    "Yorro", "Zing"
  ],
  "Yobe": [
    "Bade", "Bursari", "Damaturu", "Fika", "Fune", "Geidam", "Gujba",
    "Gulani", "Jakusko", "Karasuwa", "Karawa", "Machina", "Nangere",
    "Nguru Potiskum", "Tarmua", "Yunusari", "Yusufari"
  ],
  "Zamfara": [
    "Anka", "Bakura", "Birnin Magaji", "Bukkuyum", "Bungudu", "Gummi",
    "Gusau", "Kaura Namoda", "Maradun", "Maru", "Shinkafi", "Talata Mafara",
    "Tsafe", "Zurmi"
  ]
};

const SubmitReport = () => {
  const navigate = useNavigate();

  // State for user input fields
  const [userInput, setUserInput] = useState({
    title: "",
    issue_type: "",
    description: "",
    severity: "medium",
  });

  // State for government jurisdiction data
  const [governmentData, setGovernmentData] = useState({
    state: "",
    local_government: "",
  });

  // State for location data (auto-populated from GPS)
  const [locationData, setLocationData] = useState({
    latitude: "",
    longitude: "",
    location_address: "",
  });

  // State for images
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [locationError, setLocationError] = useState("");

  // Hooks
  const {
    location,
    address,
    loading: geoLoading,
    fetchLocation,
    getAddress,
  } = useGeolocation();
  const { createReport } = useReportStore();
  const { getAllIssues, issues } = useIssuesStore();

  // Fetch issues on mount
  useEffect(() => {
    const fetchIssues = async () => {
      await getAllIssues();
    };
    fetchIssues();
  }, []);

  // Fetch location on mount
  useEffect(() => {
    const initLocation = async () => {
      setIsFetchingLocation(true);
      setLocationError("");
      try {
        await fetchLocation();
      } catch (error) {
        console.error("Location fetch error:", error);
        setLocationError("Unable to detect location. Please enable location services.");
      } finally {
        setIsFetchingLocation(false);
      }
    };
    initLocation();
  }, []);

  // Update location data when geolocation is available
  useEffect(() => {
    if (location.latitude && location.longitude) {
      setLocationData((prev) => ({
        ...prev,
        latitude: location.latitude,
        longitude: location.longitude,
      }));
      getAddress();
    }
  }, [location.latitude, location.longitude]);

  // Update address when available
  useEffect(() => {
    if (address) {
      setLocationData((prev) => ({
        ...prev,
        location_address: `${address.city || ""}, ${address.country || ""}`.trim(),
      }));
    }
  }, [address]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "state") {
      setGovernmentData({
        state: value,
        local_government: "" // Reset LGA when state changes
      });
    } else if (name === "local_government") {
      setGovernmentData((prev) => ({ ...prev, local_government: value }));
    } else {
      setUserInput((prev) => ({ ...prev, [name]: value }));
    }

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Manual refresh of location
  const handleRefreshLocation = async () => {
    setIsFetchingLocation(true);
    setLocationError("");
    try {
      await fetchLocation();
      toast.info("Refreshing location data...");
    } catch (error) {
      console.error("Error refreshing location:", error);
      setLocationError("Failed to refresh location. Please check your location settings.");
      toast.error("Could not refresh location");
    } finally {
      setIsFetchingLocation(false);
    }
  };

  // Handle severity button clicks
  const handleSeverityChange = (severity) => {
    setUserInput((prev) => ({ ...prev, severity }));
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    const validFiles = files.filter((file) => {
      const isValidType = file.type.startsWith("image/");
      const isValidSize = file.size <= 5 * 1024 * 1024;

      if (!isValidType) {
        toast.error(`${file.name} is not a valid image file`);
        return false;
      }
      if (!isValidSize) {
        toast.error(`${file.name} exceeds 5MB size limit`);
        return false;
      }
      return true;
    });

    if (images.length + validFiles.length <= 5) {
      setImages((prev) => [...prev, ...validFiles]);
    } else {
      toast.error("Maximum 5 images allowed");
    }
  };

  // Remove image
  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!userInput.title.trim()) {
      newErrors.title = "Title is required";
    } else if (userInput.title.length < 10) {
      newErrors.title = "Title should be at least 10 characters";
    }

    if (!userInput.issue_type) {
      newErrors.issue_type = "Please select an issue type";
    }

    if (!userInput.description.trim()) {
      newErrors.description = "Description is required";
    } else if (userInput.description.length < 50) {
      newErrors.description = "Description should be at least 50 characters";
    }

    if (!governmentData.state) {
      newErrors.state = "Please select a state";
    }

    if (!governmentData.local_government) {
      newErrors.local_government = "Please select a local government area";
    }

    if (!locationData.latitude || !locationData.longitude) {
      newErrors.location =
        "Location coordinates are required. Please wait for detection or enable location services";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill in all required fields correctly");
      return;
    }

    const formData = new FormData();

    formData.append("title", userInput.title);
    formData.append("issue_type", userInput.issue_type);
    formData.append("description", userInput.description);
    formData.append("severity_level", userInput.severity);
    formData.append("state", governmentData.state);
    formData.append("local_government", governmentData.local_government);
    formData.append("latitude", locationData.latitude);
    formData.append("longitude", locationData.longitude);
    formData.append("location_address", locationData.location_address);

    images.forEach((image) => {
      formData.append("files", image);
    });

    setIsLoading(true);
    try {
      const response = await createReport(formData);

      if (response.success) {
        setUserInput({
          title: "",
          issue_type: "",
          description: "",
          severity: "medium",
        });
        setGovernmentData({
          state: "",
          local_government: "",
        });
        setImages([]);
        setSuccessMessage("Report submitted successfully!");

        setTimeout(() => {
          setSuccessMessage("");
        }, 5000);
      } else {
        throw new Error(response.message || "Failed to submit report");
      }
    } catch (error) {
      console.error("Error submitting report:", error);
      toast.error(error.message || "Failed to submit report. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Severity options
  const severityOptions = [
    {
      value: "low",
      label: "Low",
      color: "bg-green-100 text-green-800 border-green-300",
      icon: Info,
      description: "Minor issue, not urgent",
    },
    {
      value: "medium",
      label: "Medium",
      color: "bg-yellow-100 text-yellow-800 border-yellow-300",
      icon: AlertCircle,
      description: "Moderate issue, needs attention",
    },
    {
      value: "high",
      label: "High",
      color: "bg-orange-100 text-orange-800 border-orange-300",
      icon: AlertTriangle,
      description: "Serious issue, requires prompt action",
    },
    {
      value: "critical",
      label: "Critical",
      color: "bg-red-100 text-red-800 border-red-300",
      icon: AlertTriangle,
      description: "Emergency, requires immediate action",
    },
  ];

  return (
    <PageLayout pageTitle="Submit Report">
      <div className="max-w-4xl mx-auto">
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-green-800">{successMessage}</p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Form Header */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 border-b border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Submit Environmental Report
                </h1>
                <p className="text-gray-600">
                  Help protect the environment by reporting issues in your community
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {/* Title Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-semibold text-gray-900">
                  Report Title *
                </label>
                <span className="text-xs text-gray-500">
                  {userInput.title.length}/100 characters
                </span>
              </div>
              <input
                type="text"
                name="title"
                value={userInput.title}
                onChange={handleChange}
                maxLength={100}
                placeholder="e.g., Illegal waste dumping near Central Park causing health hazards"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition ${
                  errors.title ? "border-red-300" : "border-gray-300"
                }`}
                required
              />
              {errors.title && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.title}
                </p>
              )}
              <p className="text-xs text-gray-500">
                Be specific and descriptive. Include location and issue type in the title.
              </p>
            </div>

            {/* Issue Type & Severity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Issue Type */}
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-gray-900">
                  Issue Type *
                </label>
                <div className="relative">
                  <select
                    name="issue_type"
                    value={userInput.issue_type}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition appearance-none ${
                      errors.issue_type ? "border-red-300" : "border-gray-300"
                    }`}
                    required
                  >
                    <option value="">Select an issue type</option>
                    {issues.map((issue) => (
                      <option key={issue.id} value={issue.id}>
                        {issue.name}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
                {errors.issue_type && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.issue_type}
                  </p>
                )}
              </div>

              {/* Severity Level */}
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-gray-900">
                  Severity Level *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {severityOptions.map((level) => {
                    const Icon = level.icon;
                    return (
                      <button
                        key={level.value}
                        type="button"
                        onClick={() => handleSeverityChange(level.value)}
                        className={`py-3 px-2 rounded-lg border flex flex-row items-center justify-center gap-1 transition-all ${
                          userInput.severity === level.value
                            ? `${level.color} ring-2 ring-offset-1 ring-opacity-50`
                            : "bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="font-medium text-sm">{level.label}</span>
                      </button>
                    );
                  })}
                </div>
                <p className="text-xs text-gray-500">
                  {severityOptions.find((l) => l.value === userInput.severity)?.description}
                </p>
              </div>
            </div>

            {/* State and Local Government Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* State Selection */}
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-gray-900 flex items-center gap-2">
                  <Map className="w-4 h-4" />
                  State *
                </label>
                <div className="relative">
                  <select
                    name="state"
                    value={governmentData.state}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition ${
                      errors.state ? "border-red-300" : "border-gray-300"
                    }`}
                    required
                  >
                    <option value="">Select a state</option>
                    {Object.keys(nigerian_states).sort().map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.state && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.state}
                  </p>
                )}
                <p className="text-xs text-gray-500">Select the state where the issue is located</p>
              </div>

              {/* Local Government Selection */}
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-gray-900 flex items-center gap-2">
                  <Building className="w-4 h-4" />
                  Local Government *
                </label>
                <div className="relative">
                  <select
                    name="local_government"
                    value={governmentData.local_government}
                    onChange={handleChange}
                    disabled={!governmentData.state}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition ${
                      errors.local_government ? "border-red-300" : "border-gray-300"
                    } ${!governmentData.state ? "bg-gray-100 cursor-not-allowed" : ""}`}
                    required
                  >
                    <option value="">
                      {governmentData.state ? "Select a local government" : "Select a state first"}
                    </option>
                    {governmentData.state && nigerian_states[governmentData.state]?.sort().map((lga) => (
                      <option key={lga} value={lga}>
                        {lga}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.local_government && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.local_government}
                  </p>
                )}
                <p className="text-xs text-gray-500">Select the local government area</p>
              </div>
            </div>

            {/* GPS Location - Auto-detected */}
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-gray-900">
                GPS Location Coordinates (Auto-detected) *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={
                    locationData.latitude && locationData.longitude
                      ? `${locationData.latitude}, ${locationData.longitude}`
                      : (isFetchingLocation || geoLoading
                          ? "Detecting coordinates..."
                          : locationError || "Coordinates not available")
                  }
                  readOnly
                  className={`w-full pl-10 pr-24 py-3 border rounded-lg ${
                    errors.location || locationError
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300 bg-gray-100"
                  }`}
                />
                {!isFetchingLocation && !geoLoading && (
                  <button
                    type="button"
                    onClick={handleRefreshLocation}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-600 hover:text-green-700 text-sm font-medium flex items-center gap-1"
                  >
                    <Loader2 className={`w-4 h-4 ${isFetchingLocation ? "animate-spin" : ""}`} />
                    Refresh
                  </button>
                )}
              </div>
              {errors.location && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.location}
                </p>
              )}
              {locationError && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {locationError}
                </p>
              )}
              {(isFetchingLocation || geoLoading) && (
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Detecting your coordinates...
                </p>
              )}
              <p className="text-xs text-gray-500">
                Your GPS coordinates are automatically detected. Make sure location services are enabled in your browser.
              </p>
            </div>

            {/* Location Address */}
            {locationData.location_address && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Location Address (Auto-detected)
                </label>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-700">{locationData.location_address}</p>
                </div>
              </div>
            )}

            {/* Description */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-semibold text-gray-900">
                  Detailed Description *
                </label>
                <span className="text-xs text-gray-500">
                  {userInput.description.length}/2000 characters
                </span>
              </div>
              <textarea
                name="description"
                value={userInput.description}
                onChange={handleChange}
                maxLength={2000}
                placeholder="Describe the issue in detail. Include:
• Exact location details
• When you first noticed the issue
• How it's affecting the community
• Any immediate dangers or hazards
• What you think should be done"
                rows="6"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition resize-none ${
                  errors.description ? "border-red-300" : "border-gray-300"
                }`}
                required
              />
              {errors.description && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.description}
                </p>
              )}
              <p className="text-xs text-gray-500">
                The more details you provide, the easier it will be for authorities to take action.
              </p>
            </div>

            {/* Image Upload */}
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-gray-900">
                Upload Evidence {images.length > 0 && `(${images.length}/5)`}
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-green-400 transition-colors">
                <div className="text-gray-500 mb-4">
                  <Camera className="w-10 h-10 mx-auto mb-3 text-gray-400" />
                  <p className="font-medium">Drag & drop photos or click to upload</p>
                  <p className="text-sm mt-1">
                    Maximum 5 images, 5MB each. Supported formats: JPG, PNG, WebP
                  </p>
                </div>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  id="file-upload"
                  onChange={handleImageUpload}
                  disabled={images.length >= 5}
                />
                <label
                  htmlFor="file-upload"
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium cursor-pointer transition-colors ${
                    images.length >= 5
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700 text-white"
                  }`}
                >
                  <Upload className="w-4 h-4" />
                  {images.length >= 5 ? "Maximum 5 images reached" : "Choose Files"}
                </label>
              </div>

              {/* Preview Images */}
              {images.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-900 mb-3">
                    Selected Images ({images.length}/5)
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Form Actions */}
            <div className="pt-8 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !locationData.latitude}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="animate-spin" />
                      Submitting report...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <AlertCircle className="w-5 h-5" />
                      Submit Report
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Info Note */}
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
              <div className="flex gap-3">
                <FileText className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-blue-900 mb-1">
                    Important Information
                  </p>
                  <ul className="text-xs text-blue-800 space-y-1">
                    <li>• Reports are reviewed within 24-48 hours by local authorities</li>
                    <li>• Provide accurate government jurisdiction for proper routing</li>
                    <li>• Include clear photos as evidence when possible</li>
                    <li>• You can track your report status in "My Reports" section</li>
                    <li>• False or misleading reports may lead to account suspension</li>
                    <li>• For emergencies, contact local authorities directly</li>
                  </ul>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </PageLayout>
  );
};

export default SubmitReport;