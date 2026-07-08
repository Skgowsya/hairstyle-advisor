import * as faceapi from "face-api.js";
import { useState,useEffect } from "react";
import axios from "axios";
import {useRef} from "react";


import fade from "./assets/fade cut.jpg";
import buzz from "./assets/buzz cut.jpg";
import crew from "./assets/crew cut.jpg";
import frenchcrop from "./assets/frenchcrop cut.jpg";
import Pompadour from "./assets/Pompadour cut.jpg";
import under from "./assets/under cut.jpg";
import curtainbags from "./assets/curtainbags cut.jpg";
import longlayers from "./assets/longlayers cut.jpg";
import pixie from "./assets/pixie cut.jpg";
import wolf from "./assets/wolf cut.jpg";
import bob from "./assets/bob.jpg";
import butterfly from "./assets/butterfly cut.jpg";

export default function App() {
const [activeTab, setActiveTab] = useState("Home");
const [search, setSearch]=useState("");
const [file, setFile] = useState(null);
const [preview, setPreview] = useState(null);
const [message, setMessage] = useState("");
const [hairstyle, setHairstyle] = useState("");
const [previewMessage, setPreviewMessage] = useState("");
const [generatedStyle, setGeneratedStyle] = useState("");
const [generatedImage,setGeneratedImage]=useState(null);
const [loading, setLoading] = useState(false);
const [history,setHistory] = useState([]);
const [category,setCategory]=useState("Men");
const [uploadedImage, setUploadedImage]=useState(null);

const [faceShape, setFaceShape] = useState("");
const [growthHistory, setGrowthHistory] = useState([]);
const [hairGoal,setHairGoal]=useState("");
const [matchScore,setMatchScore]=useState("");
const [bestStyle,setBestStyle]=useState("");
const [advisorMessage,setAdvisorMessage]=useState("");
const [topRecommendations,setTopRecommendations]=useState([]);
const [detectedFaceShape,setDetectedFaceShape]=useState("");
const [compareStyle1,setCompareStyle1]=useState("");
const [compareStyle2,setCompareStyle2]=useState("");
const [confidence, setConfidence] = useState("");
const [modelsLoaded,setModelsLoaded]=useState(false);
const [result, setResult] = useState(null);
const imageRef=useRef(null);



const hairstyles = [
{ name: "Fade Cut", image: fade, category:"Men" },
{ name: "Buzz Cut", image: buzz, category:"Men"},
{ name: "Crew Cut", image: crew, category:"Men" },
{ name: "French Crop", image: frenchcrop, category:"Men"},
{ name: "Pompadour", image: Pompadour, category:"Men" },
{ name: "Under Cut", image: under, category:"Men" },

{name:"Curtainbags Cut", image: curtainbags, category:"Women"},
{name:"Longlayers Cut", image: longlayers, category:"Women"},
{name:"Pixie Cut", image: pixie, category:"Women"},
{name:"Wolf Cut", image: wolf, category:"Women"},
{name:"Bob Cut", image: bob, category:"Women"},
{name:"Butterfly Cut", image: butterfly, category:"Women"},

];

const API_URL =
  import.meta.env.DEV
    ? "http://localhost:5000"
    : "https://hairstyle-backend-he65.onrender.com";



const [favorites,setFavorites]=useState(()=>{
  const saved = localStorage.getItem("favorites");
  return saved ? JSON.parse(saved) : [];
});

useEffect(() => {
  localStorage.setItem(
    "favorites",
    JSON.stringify(favorites)
  );
}, [favorites]);

const handleFileChange = (event) => {
const selectedFile = event.target.files[0];

if(selectedFile){
  setFile(selectedFile);
  setUploadedImage(URL.createObjectURL(selectedFile));
  setPreview(URL.createObjectURL(selectedFile));

}

};



const uploadImage = async () => {
if (!file) {
setMessage("Please select an image");
return;
}

if (!hairstyle) {
  setMessage("Please select a hairstyle");
  return;
}

const formData = new FormData();
formData.append("image", file);
formData.append("hairstyle", hairstyle);

try {
  const response = await fetch(`${API_URL}/upload`, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();


  if (data.success) {
    
    setMessage(
      `Upload successful! Hairstyle: ${data.hairstyle}`
    );

  } else {
    setMessage("Upload failed!");
  }
} catch (error) {
  console.error(error);
  setMessage("Error uploading image");
}

};


const generatePreview = async () => {
  console.log("Generate Preview button clicked");
  if (!file || !hairstyle) {
    setPreviewMessage(
      "Please upload a photo and select a hairstyle"
    );
    return;
  }

  setLoading(true);

  try {
    const response = await axios.post(`${API_URL}/generate-preview`);

    const data = response.data;

    if (data.success) {
      setGeneratedStyle(hairstyle);
      setPreviewMessage(data.message);
      setMessage(
        `Uploaded successful! Hairstyle: ${hairstyle}`
      );

      setHistory((prev) => [
        ...prev,
        {
          hairstyle,
          filename: data.filename,
        },
      ]);
    } else {
      setPreviewMessage(data.message);
    }
  } catch (error) {
    console.error(error);
    setPreviewMessage("Preview generation failed");
  }

  setLoading(false);
};


const downloadImage = () => {
  if (!preview) return;

  const link = document.createElement("a");
  link.href = preview;
  link.download = "hairstyle-preview.jpg";
  link.click();
};
useEffect(() => {
  const savedHistory = localStorage.getItem("history");

  if (savedHistory) {
    setHistory(JSON.parse(savedHistory));
  }
}, []);

useEffect(() => {
  localStorage.setItem(
    "history",
    JSON.stringify(history)
  );
}, [history]);

const [detectionHistory,setDetectionHistory]=useState(()=>{
  const saved = localStorage.getItem("detectionHistory");
  return saved ? JSON.parse(saved) : [];
});

useEffect(()=>{
  localStorage.setItem(
    "detectionHistory",
    JSON.stringify(detectionHistory)
  );
},[detectionHistory]);

useEffect(()=>{
  const savedGrowthHistory=localStorage.getItem("growthHistory");
  if(savedGrowthHistory){
    setGrowthHistory(
      JSON.parse(savedGrowthHistory)
    );
  }
},[]);

useEffect(()=>{
  console.log("Saving : ",growthHistory);
  localStorage.setItem(
    "growthHistory",
    JSON.stringify(growthHistory)
  );
},[growthHistory]);

useEffect(()=>{
  if(!detectedFaceShape)
    return;
  if(category==="Men"){
    setTopRecommendations(
      menRecommendations[detectedFaceShape]||[]
    );
  }else{
    setTopRecommendations(
      womenRecommendations[detectedFaceShape]||[]
    );
  }
},[detectedFaceShape,category]);

useEffect(() => {
  const loadModels = async () => {
    try {
      await faceapi.nets.tinyFaceDetector.loadFromUri(`${import.meta.env.BASE_URL}models`);
await faceapi.nets.faceLandmark68Net.loadFromUri(`${import.meta.env.BASE_URL}models`);
      console.log("Models loaded");
    } catch (err) {
      console.error("Model loading error:", err);
    }
  };

  loadModels();
}, []);



useEffect(() => {
  console.log("Category changed to:", category);
}, [category]);



const handleAnalyze = async () => {
  if(!imageRef.current){
    alert("Please upload an image first");
    return;
  }
  
  const img = imageRef.current;

  console.log("Image src:", imageRef.current?.src);
  
  const result = await detectFaceShape(img);
  console.log(result);
  if(result==="No face detected"){
    setFaceShape(result);
    return;
  }

  setFaceShape(result);
  setDetectedFaceShape(result);
  setConfidence(95);
  const randomConfidence =
  Math.floor(Math.random() * 15) + 80;

setConfidence(randomConfidence);
  await analyzeWithAI(preview,result);
};


const detectFaceShape = async (img) => {
  if(!faceapi.nets.tinyFaceDetector.isLoaded){
    console.log("Tiny face detector model is not working");
    return;
  }
  const detection = await faceapi
    .detectSingleFace(
      img,
      new faceapi.TinyFaceDetectorOptions()
    )
    .withFaceLandmarks();

  if (!detection) {
    return "No face detected";
  }

  const landmarks = detection.landmarks;

  const jaw = landmarks.getJawOutline();
  const leftBrow = landmarks.getLeftEyeBrow();
  const rightBrow = landmarks.getRightEyeBrow();

  const jawWidth = Math.abs(
    jaw[16].x - jaw[0].x
  );

  const foreheadWidth = Math.abs(
    rightBrow[4].x - leftBrow[0].x
  );

  const browY =
  (leftBrow[2].y + rightBrow[2].y) / 2;

const foreheadTop =
  browY - (jawWidth * 0.35);

const faceLength = Math.abs(
  jaw[8].y - foreheadTop
);

  const ratio = faceLength / jawWidth;
  const foreheadRatio = foreheadWidth / jawWidth;
  console.log("Forehead Ration : ",foreheadRatio);

  console.log("Jaw Width:", jawWidth);
console.log("Forehead Width:", foreheadWidth);
console.log("Face Length:", faceLength);
console.log("Ratio:", ratio);



  if (ratio > 1.35) {
  return "Oval";
  
}

if (ratio >= 1.29) {
  return "Square";
  
}

if (
  foreheadRatio > 0.95
) {
  return "Heart";
  
}

if (
  foreheadRatio < 0.80
) {
  return  "Diamond";
  
}

return "Round";
};




const filteredStyles = hairstyles
  .filter((style) => style.category === category)
  .filter((style) =>
    style.name.toLowerCase().includes(search.toLowerCase())
  );

const recommendations = {
  Round: ["Pompadour", "Under Cut", "French Crop"],
  Oval: ["Fade Cut", "Crew Cut", "Pompadour"],
  Square: ["Buzz Cut", "Crew Cut", "Under Cut"],
  Heart: ["French Crop", "Fade Cut"],
  Diamond: ["Pompadour", "Under Cut"],
};

const copyBarberCard=()=>{
  navigator.clipboard.writeText(
    `I want a ${hairstyle} hairstyle.Please keep the style similar to the preview.`
  );
  alert("Barber instructions copied!");
}
const findBestHairStyle=()=>{
  if(!faceShape){
    alert("Please select a face shape");
    return;
  }
  let bestMatch;
  if(category === "Men"){
    bestMatch=menRecommendations[faceShape][0];
  }else{
    bestMatch=womenRecommendations[faceShape][0];
  }
  setBestStyle(bestMatch);
};

const shareBarberCard = async () => {
  const text = `
💈 Barber Instructions

Hairstyle: ${hairstyle}
Face Shape: ${faceShape}

I want a ${hairstyle} hairstyle.
Please keep the style similar to the preview.
`;

  if (navigator.share) {
    try {
      await navigator.share({
        title: "Barber Instructions",
        text: text,
      });
    } catch (error) {
      console.log(error);
    }
  } else {
    alert("Sharing not supported on this device");
  }
};

const menRecommendations={
  Round:["Pompadour","Under Cut","French Crop"],
  Oval:["Fade Cut","Crew Cut","Pompadour"],
  Square:["Buzz Cut","Crew Cut","Under Cut"],
  Heart:["French Crop","Fade Cut"],
  Diamond:["Pompadour","Under Cut"],
};

const womenRecommendations={
  Round:["Longlayers Cut","Curtainbags Cut","Butterfly Cut"],
  Oval:["Bob Cut","Butterfly Cut","Longlayers Cut"],
  Square:["Wolf Cut","Longlayers Cut","Curtainbags Cut"],
  Heart:["Bob Cut","Butterfly Cut"],
  Diamond:["Butterfly Cut","Pixie Cut","Bob Cut"],
};

const getAdvisorAdvice=()=>{
  if(!faceShape){
    setAdvisorMessage("Please select a faceShape");
    return;
  }
  if(category==="Men"){
    if(faceShape==="Round"){
      setAdvisorMessage(
        " Pompadour is recommended because it adds height and makes the face look longer."
      );
    }else if(faceShape==="Oval"){
      setAdvisorMessage(
        "Fade Cut suits oval faces because of balanced proportions."
      );
    }else if(faceShape==="Square"){
      setAdvisorMessage(
        "Crew cut is works well with strong jawlines"
      );
    }else if(faceShape==="Heart"){
      setAdvisorMessage(
        "French crop is balances a wider forehead"
      );
    }else if(faceShape==="Diamond"){
      setAdvisorMessage(
       "Pompadour adds volume and balances facial features" 
      );
    }
  }else{
    if(faceShape==="Round"){
      setAdvisorMessage(
        "Layer cut helps create a similar appearance."
      );
    }else if(faceShape==="Oval"){
      setAdvisorMessage(
        "Bob cut looks great on oval face shape."
      );
    }else if(faceShape==="Square"){
      setAdvisorMessage(
        "Wolf Cut softens strong facial angles."
      );
    }else if(faceShape==="Heart"){
      setAdvisorMessage(
        "Long waves balance forehead and skin proportions."
      );
    }else if(faceShape==="Diamond"){
      setAdvisorMessage(
       "Butterfly cut highlight cheekbones beautifully." 
      );
    }
  }
};

const getTopRecommendations=()=>{
  if(!faceShape){
    return;
  }
  if(category==="Men"){
    setTopRecommendations(
      menRecommendations[faceShape]
    );
  }else{
    setTopRecommendations(
      womenRecommendations[faceShape]
    );
  }
};



const buttonStyle = {
  backgroundColor: "#2563eb",
  color: "white",
  border: "none",
  padding: "12px 20px",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "bold",
};


const getPossibleMatches = (shape, confidence) => {
  if (confidence >= 90) return "";

  switch (shape) {
    case "Square":
      return "Oval, Diamond";

    case "Oval":
      return "Square, Heart";

    case "Round":
      return "Oval, Square";

    case "Heart":
      return "Oval, Diamond";

    case "Diamond":
      return "Oval, Heart";

    default:
      return "";
  }
};

const downloadBarberInstructions=()=>{
  const text =`
  Hairstyle : ${hairstyle}
  Face Shape : ${faceShape}
  Instructions: 
  I want a ${hairstyle} hairstyle.
  Please keep the Style similar to the preview.`;

  const blob = new Blob([text],{
    type: "text/plain"
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download="barber-instructions.txt";
  link.click();

  URL.revokeObjectURL(url);
};

const analyzeWithAI = async (imageBase64, detectedFaceShape) => {
  console.log("Category inside analyzeWithAI:", category);

  try {
    setLoading(true);

    const response = await fetch(`${API_URL}/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image: imageBase64,
        faceShape: detectedFaceShape,
        category: category,
      }),
    });

    const data = await response.json();
    

    console.log("AI RESULT:", data);
    
  console.log("category stage : ",category);

    setResult(data);
  } catch (error) {
    console.log("ERROR:", error);
  } finally {
    setLoading(false);
  }
};


return (
<div
style={{
maxWidth: "1000px",
margin: "auto",
textAlign: "center",
padding: "20px",
background: "#f8fafc",
minHeight: "100vh",
borderRadius: "15px",

}}
>
<div
style={{
background:
"linear-gradient(135deg,#2563eb,#7c3aed)",
padding:"30px",
borderRadius:"20px",
marginBottom:"25px",
color:"white",
}}
>


<h1
style={{
fontSize:"38px",
margin:0,
}}
>
💇 Hairstyle Advisor
</h1>
<br/>
<p>
Find your perfect hairstyle using AI
</p>
</div>
<div
  style={{
    display: "flex",
    justifyContent: "center",
    gap: "15px",
    marginBottom: "25px",
    flexWrap: "wrap",
  }}
>
  
  <button onClick={()=>
    setActiveTab("upload")}>

    📸 Upload
  
  </button>
<button onClick={()=>
  setActiveTab("detect")}>

    🎯 Detect

</button>

<button onClick={()=>
  setActiveTab("styles")}>
  
    💇 Styles

  </button>

  <button onClick={()=>
    setActiveTab("preview")
  }>
    ✨ Preview
  </button>

  <button onClick={()=>
    setActiveTab("favorites")}>
    
    ❤️ Favorites
  </button>

  <button onClick={()=>
    setActiveTab("ai analysis")
  }>
      🤖 AI Analysis
  </button>

  <button onClick={()=>
setActiveTab("history")}>

  📜 History

</button>
</div>

<div
  style={{
    background: "white",
    padding: "25px",
    borderRadius: "20px",
    marginBottom: "25px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
  }}
>
  <h2 style={{ color: "#2563eb" }}>
    Welcome to Hairstyle Advisor
  </h2>

  <p>
    Upload your photo, detect your face shape,
    and discover hairstyles that suit you best.
  </p>

  
</div>

{activeTab === "upload" && (
  <>

  <div
  style={ buttonStyle }
>
  <h2> 📸 Upload Your Photo</h2>
   
  <input
    type="file"
    accept="image/*"
    onChange={handleFileChange}
  />
 
  <br/>
  <br/>

  {preview && (
  <div
    style={{
      background: "white",
      padding: "20px",
      borderRadius: "20px",
      margin: "20px auto",
      maxWidth: "400px",
      boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
    }}
  >
    <h2>📸 Your Photo</h2>

    <img
      ref={imageRef}
      src={preview}
      alt="user"
      style={{
        width: "100%",
        maxWidth: "350px",
        borderRadius: "15px",
      }}
    />
  </div>
)}
</div>

<br/>
<br/>

<button
  onClick={uploadImage}
  style={{
    backgroundColor: "#2563eb",
    color: "white",
    border: "none",
    padding: "12px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
  }}
>
  📤 Upload Photo
</button>

</>
)}

<br/>

{activeTab === "detect" && (
  <>

<h2>Select Face Shape</h2>

<select
  value={faceShape}
  onChange={(e) => setFaceShape(e.target.value)}
  style={{
    padding: "10px",
    borderRadius: "10px",
    marginBottom: "20px",
  }}
>
  <option value="">Choose Face Shape</option>
  <option value="Round">Round</option>
  <option value="Oval">Oval</option>
  <option value="Square">Square</option>
  <option value="Heart">Heart</option>
  <option value="Diamond">Diamond</option>
    </select>
    
<br/>
<br/>

{preview && (
  <div
  style={{
    textAlign:"center",
    marginBottom:"20px",
  }}
  >
  <img
    ref={imageRef}
    src={preview}
    alt="Uploaded"
    width="250"
    style={{
      borderRadius: "15px",
      display:"block",
      margin: "0 auto",
      
    }}
  />
  </div>
)}

<br/>

<button 
onClick={handleAnalyze}
style={ buttonStyle }
>
  Auto Detect Face
 </button>

 <h3
 style={{
  padding: "10px",
    borderRadius: "5px",
    marginBottom: "20px",
 }}
 >
<p>Detected Face is : <b>{faceShape}</b></p>
</h3>




<br/>
<br/>

{detectedFaceShape &&(
  <div
  style={buttonStyle}
  >
    
    <h2>🎯 Face Analysis</h2>

    <h3>
    Face Shape : 
      <span style={{ color : "white"}}>{" "}{detectedFaceShape}</span>
    </h3>
    

<h3>
Confidence : 
  <b style ={{ color : "white" }}>
  {" "}{confidence}%
  </b>
</h3>


{getPossibleMatches(
  detectedFaceShape,
  confidence
) && (
  <p>
    <h3>Possible Matches :
      <b style = {{color : "#16a34a"}}>{" "}</b>
      
    {getPossibleMatches(
      detectedFaceShape,
      confidence
    )}
    </h3>
  </p>
)}
    </div>
)}


</>
)}
<br/>
<br/>

{activeTab === "styles" && (
  <>

  <h2> Select Category</h2>
  <div
  style={{
    display:"flex",
    justifyContent:"center",
    gap:"20px",
    marginBottom:"30px",
  }}
  >
  <button onClick={()=>setCategory("Men")}
  style={{
    padding: "12px 25px",
    fontSize:"18px",
    borderRadius:"10px",
    border:"none",
    cursor:"pointer",
    backgroundColor:category==="Men"?"#2563eb":"#e5e7eb",
    color:
    category==="Men"?"white":"black",fontWeight:"bold",

  }}
>
    👨 Men
    </button>
    <button onClick={()=>setCategory("Women")}
      style={{
        padding:"12px 25px",
        fontSize:"18px",
        borderRadius:"10px",
        border:"none",
        cursor:"pointer",
        backgroundColor:category==="Women"?"#ec4899":"#e5e7eb",

        color:
        category==="Women"?"white":"black",fontWeight:"bold",
      }}
      >
        👩 Women
      </button>


      </div>
<br/>
<br/>

<button 
  onClick={getTopRecommendations}
  style={{
    marginLeft:"10px",
    backgroundColor:"#f59e0b",
    color:"white",
    border:"none",
    padding:"12px 20px",
    borderRadius:"10px",
    cursor:"pointer",
  }}
  >
    Top Recommendations
  </button>

  {topRecommendations.length > 0 && (
    <div
    style={{
      backgroundColor:"white",
      padding:"20px",
      borderRadius:"15px",
      margin:"20px auto",
      maxWidth:"500px",
      boxShadow:"0 4px 10px rgba(0,0,0,0.2)",
      
    }}
  >
  <div
  style={{
    display : "flex",
    justifyContent:"center",
    gap:"20px",
    flexWrap:"wrap",
  }}
  >

  {topRecommendations.map((item,index)=>{
    const styleData=hairstyles.find((style)=>style.name===item);
    return(
     <div
     key={index}
     style={{
      backgroundColor:"#f9fafb",
      padding:"10px",
      borderRadius:"10px",
      width:"180px",
     }}
     >
      <img 
      src={styleData?.image}
      onLoad={()=> console.log("Loaded : ",styleData?.image)}
      onError={()=>console.log("Failed : ",styleData?.image)}
      alt={item}
      width="150"
      height="150"
      style={{
        objectFit:"cover",
        borderRadius:"10px",
      }}
      />
      <h4>{item}</h4>
      
      </div>
    );
})}
</div>
</div>
  )}


<br/>
<br/>

      <input
       type="text"
       placeholder="Search hairstyle..."
       value={search}
       onChange={(e) => setSearch(e.target.value)}
       style={{
        width:"350px",
         padding: "12px",
         width: "350px",
         borderRadius: "12px",
         boxShadow:"0 4px 10px rgba(0,0,0,0.15)",
         border: "none",
         fontSize:"16px",
  }}
  />
<br/>
  <br/>

      <div
style={{
  backgroundColor:"white",
  padding:"20px",
  borderRadius:"15px",
  marginTop: "20px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.2)"
}}
>

  <h2>Select a Hairstyle</h2>
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      gap: "20px",
      flexWrap: "wrap",
    }}
  >
    { filteredStyles.length===0 ?(<h3 style={{color: "#ffffff",backgroundColor:"#ef4444",padding:"10px",borderRadius:"10px",display:"inline-block",}}>No hairstyles found 😢</h3>):(filteredStyles.map((style)=>(
      <div
        key={style.name}
        onClick={() => {
          setHairstyle(style.name);
        if(
          recommendations[faceShape]?.includes(style.name)
        ) {
          setMatchScore("95%");
        }else{
          setMatchScore("75%");
        }
        }}

        style={{
  border:
    hairstyle === style.name
      ? "3px solid #2563eb"
      : "1px solid #e5e7eb",
  borderRadius: "15px",
  padding: "15px",
  cursor: "pointer",
  backgroundColor: "white",
  boxShadow: "0 6px 15px rgba(0,0,0,0.12)",
  transition: "0.3s",
  width: "220px",
}}
      >
        <img
          src={style.image}
          alt={style.name}
          width="200"
          height="200"
          style={{
            objectFit: "cover",
            borderRadius: "12px",
          }}
        />

        <p>{style.name}</p>

         {faceShape &&

           recommendations[faceShape]?.includes(style.name) && (
         <div
              style={{
                backgroundColor:"#dcfce7",
                color: "#166534",
                padding:"5px",
                borderRadius:"10px",
                fontWeight:"bold",
               fontSize: "14px",
                 
              }}
              >
              ⭐ Best Match
                  </div>
                )}

        <button
        onClick={(e)=>{
          e.stopPropagation();
        
        setFavorites((prev) =>
        prev.includes(style.name)
        ? prev.filter((item)=> item !== style.name):[...prev,style.name]  
    );
  }}

>
  {favorites.includes(style.name)
  ? "❤️ Saved"
  : "🤍 Save"}
</button>
      </div>
    ))
  )}
  </div>
  </div>
  <br/>
  <br/>

  

<div 
style={{
  backgroundColor:"white",
  padding:"20px",
  borderRadius:"15px",
  marginTop:"20px",
}}
>
  <h2> ⚖️ Compare Hairstyles </h2>
    
  <select 
  value={compareStyle1}
  onChange={(e)=>
    setCompareStyle1(e.target.value)}
    >
      <option value="">Select Style 1</option>
      {hairstyles.map((style)=>(
        <option key={style.name} value={style.name}>
          {style.name}
        </option>
      ))}
    </select>
    <select
    value={compareStyle2}
    onChange={(e)=>
      setCompareStyle2(e.target.value)}
      >
        <option value="">Select Style 2</option>
        {hairstyles.map((style)=>(
        <option key={style.name} value={style.name}>
          {style.name}
        </option>
        ))}
      </select>
    
   {compareStyle1 && compareStyle2 && (
  <div
    style={{
      backgroundColor:"white",
      padding:"25px",
      borderRadius:"20px",
      margin:"20px auto",
      maxWidth:"700px",
      boxShadow:"0 8px 20px rgba(0,0,0,0.15)",
    }}
  >
    <div>
      <img
        src={
          hairstyles.find(
            (s) => s.name === compareStyle1
          )?.image
        }
        width="180"
        height="180"
        style={{
          objectFit:"cover",
          borderRadius:"12px",
        }}
      />
      <p>{compareStyle1}</p>
  
     </div>


    <div>
      <img
        src={
          hairstyles.find(
            (s) => s.name === compareStyle2
          )?.image
        }
        width="180"
        height="180"
        style={{
          objectFit:"cover",
          borderRadius:"12px",
        }}
      />
      <p>{compareStyle2}</p>
      
    </div>
    
  </div>
      )}
      
{compareStyle1 && compareStyle2 && (
  <div
    style={{
      backgroundColor: "white",
      padding: "15px",
      borderRadius: "10px",
      marginTop: "20px",
    }}
  >
    <h3>🏆 Suggested Choice</h3>

    <p>
      Based on your face shape,{" "}
      <b>
        {topRecommendations.includes(compareStyle1)
          ? compareStyle1
          : topRecommendations.includes(compareStyle2)
          ? compareStyle2
          : "Both are suitable"}
      </b>
    </p>
    
  </div>
)}
</div>
  <br/>
  <br/>
  

  <button 
  onClick={getAdvisorAdvice}
  style={buttonStyle} 
  >
    Hairstyle Advisor
  </button>
  
  {advisorMessage && (
    <div
    style={{
      backgroundColor:"white",
      padding:"20px",
      borderRadius:"15px",
      margin:"20px auto",
      maxWidth:"500px",
      boxShadow:"0 4px 10px rgba(0,0,0,0.2)",
    }}
    >
      <h2> Hairstyle Advisor</h2>
      <p>{advisorMessage}</p>
    </div>
  )}

  <br/>
  <br/>

  
   <select
   value={hairGoal}
   onChange={(e)=>
    setHairGoal(e.target.value)}
    style={ buttonStyle }
    >
      <option value="">Select Hair Goal</option>
      <option value="Grow Long Hair">Grow Long Hair</option>
      <option value="Reduce Hair Fall">Reduce Hair Fall</option>
      <option value="Maintain Style">Maintain Style</option>
    </select>
  

  {hairGoal &&(
    <div 
    style={{
      backgroundColor:"white",
      padding : "15px",
      borderRadius : "15px",
      boxShadow:"0 4px 10px rgba(0,0,0,0.2)",
      margin:"20px auto",
      maxWidth:"400px",
    
    }}
    >
      <h3> Your Hair Goal</h3>
      <p>{hairGoal}</p>

      {hairGoal==="Grow Long Hair"&&(
        <p style = {{
          color:"green",
          fontWeight:"bold",
        }}>
        Estimated Time: 6-12 Months
        </p>
      )}
      {hairGoal==="Reduce Hair Fall" &&(
        <p style={{
          color:"green",
          fontWeight:"bold",
        }}>
        Focus on hair care and healthy habits
        </p>
      )}
      {hairGoal === "Maintain Style"&&(
        <p style={{
          color:"green",
          fontWeight:"bold",
        }}>
        Regular trims every 4-6 weeks
        </p>
      )}
      </div>
  )}

<br/>
<br/>

<button 
onClick={findBestHairStyle}

style={buttonStyle}  
>
  🏆 Best Hairstyle For You
  </button>  
  {bestStyle && (
    <div
    style={{
      backgroundColor:"white",
      padding:"20px",
      borderRadius:"15px",
      margin:"20px auto",
      maxWidth:"400px",
    }}
    >
      <h2> Best Hairstyle For You</h2>
      <h2>{bestStyle}</h2>
      <p>
        Based on your face shape and category 
      </p>
      </div>
  )}
<br/>

      {hairstyle && ( 
        <div
        style={{
          backgroundColor:"white",
          padding:"20px",
          borderRadius:"15px",
          margin:"20px auto",
          maxWidth:"400px",
          boxShadow:"0 4px 10px rgba(0,0,0,0.2)",
        }}
        >
          <h2>Selected a Hairstyle</h2>
        <h3 style={{ color: "#2563eb" }}>
        {hairstyle}
        </h3>
          <h2>💈 Barber Card</h2>
          <img
            src={
             hairstyles.find(
             (style) => style.name === hairstyle
             )?.image
          }
            alt={hairstyle}
         width="200"
          style={{
      borderRadius: "10px",
       marginBottom: "10px",
       }}
       />

        <h3>{hairstyle}</h3>

        <p style={{color:"#234"}}>
          Face Shape: <b>{faceShape}</b>
        </p>
        <br/>
        <p style={{color:"rgb(34, 102, 83)",}}>
          Show this hairstyle to your barber
        
        </p>
        <br/>
        <button 
        onClick = {copyBarberCard}
        style={{
          backgroundColor:"#2563eb",
          color:"white",
          border:"none",
          padding:"10px 20px",
          borderRadius:"10px",
          cursor:"pointer",
        }}
        >
          Copy instructions
        </button>


        <button
        onClick={downloadBarberInstructions}
        style={{
          marginLeft:"10px",
          backgroundColor:"#16a34a",
          color:"white",
          border:"none",
          padding:"10px 20px",
          borderRadius:"10px",
          cursor:"pointer",

        }}
        >
          📥 Download Instructions
        </button>
<br/>
<br/>
        <button
  onClick={shareBarberCard}
  style={{
    marginLeft: "10px",
    backgroundColor: "#10b981",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "10px",
    cursor: "pointer",
  }}
>
  📤 Share
</button>
        </div>
      )}

      {hairstyle && (
        <div
        style={{
          backgroundColor:"white",
          padding:"20px",
          borderRadius:"15px",
          margin:"20px auto",
          maxWidth:"500px",
          boxShadow:"0 4px 10px rgba(0,0,0,0.2)",
        }}
        >
      <h2>Barber Instructions</h2>
      <p>
        I want a <b>{hairstyle}</b> hairstyle.</p>
      <p>
        Please keep the style similar to the preview
      </p>
      </div>
      )}

      <br/>
     </> 
)}
  

  {activeTab === "preview" && (
    <>
  
  <button
  onClick={generatePreview}
  style={buttonStyle}
>
 ✨ Generate Preview 
</button>

  <br />
  <br />

  <h2>{message}</h2>

  <h3>{previewMessage}</h3>

  {loading && (
  <div
    style={{
      backgroundColor: "white",
      padding: "20px",
      borderRadius: "15px",
      margin: "20px auto",
      maxWidth: "350px",
      boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    }}
  >
    <h3>⏳ Processing...</h3>

    <p>
      Analyzing your face and preparing results.
    </p>
  </div>
)}

  {generatedStyle && (
    <div
      style={{
        marginTop: "30px",
        padding: "25px",
        borderRadius: "20px",
        backgroundColor: "white",
        
      }}
    >
    
      <h2
      style={{
        color:"#2563eb",
        marginBottom: "15px",
      }}
      >
      🪞 Preview Result</h2>

      <p>
        Selected Hairstyle: <b>{generatedStyle}</b>
      </p>

    {preview && (
        <>
        <img
          src={preview}
          alt="Generated Preview"
          width="300"
          style={{ borderRadius: "10px" }}
        />
        
        <br/>
        <br/>
        <button onClick={downloadImage}>
          Download Result
        </button>
        </>
      )}
      <br/>
      <br/>
      <button
  onClick={() => {
    if (!preview) return;

    setGrowthHistory((prev) => [
      ...prev,
      {
        month: prev.length + 1,
        image: preview,
      },
    ]);
  }}
>
  🌱 Save Growth Progress
</button>
      
    </div>
  )}
  <br/>





<h2>✨ Preview Summary</h2>

{hairstyle && (
  <div
    style={{
      backgroundColor: "white",
      padding: "15px",
      borderRadius: "10px",
      margin: "20px auto",
      maxWidth: "400px",
    }}
  >
    <p><b>Selected Hairstyle:</b> {hairstyle}</p>
    <p><b>Face Shape:</b> {faceShape}</p>
    <p><b>Match Score:</b> {matchScore}%</p>
    <p><b>Hair Goal:</b> {hairGoal}</p>
  </div>
)}

</>
  )}

{activeTab === "favorites" && (
  <>


<div 
style={{
  backgroundColor:"white",
  padding:"20px",
  borderRadius:"15px",
  marginTop:"20px",
}}
>
<h2>❤️ Favorite Hairstyles</h2>
{favorites.length === 0 ? (<p style={{color:"#dc2626",fontSize:"18px",fontWeight:"bold",boxShadow:"rgba(0,0,0,0.2)"}}>❤️ No favorites yet.
Save hairstyles to see them here.</p>) : (favorites.map((item, index) => (
    <div key={index}>
      {item}
    </div>
  ))
)}
</div>
<br/>
<br/>
<div 
style={{
  backgroundColor:"white",
  padding:"20px",
  borderRadius:"15px",
  marginTop:"20px",
}}
>
  
  <h2> 🌱 Hair Growth Timeline </h2>
  {growthHistory.length===0?(
    <p>No growth records yet</p>
    ):(growthHistory.map((item)=>(
    <div key={item.month}>
      <h4>Month {item.month}</h4>

      <img 
      src={item.image}
       width="150" 
       style={{
        borderRadius:"10px",
        marginBottom:"10px"
      }}
        />
        </div>
      ))
      )}
</div>

</>
)}

{activeTab === "ai analysis" && (
  <>
  {loading && <p>Analyzing AI...</p>}

{result && (
  <div
    style={{
      backgroundColor: "white",
      padding: "20px",
      borderRadius: "15px",
      margin: "20px auto",
      maxWidth: "500px",
    }}
  >
    <h2>🤖 AI Analysis</h2>

    <p>
      Face Shape:
      <b> {result.localResult?.faceShape}</b>
    </p>

    <br/>
    <p>
      AI Prediction:
      <b> {result.hfResult?.prediction}</b>
    </p>

    <p>
      AI Confidence:
      <b> {result.hfResult?.confidence}%</b>
    </p>
    <br/>
    <p>Recommended Style: {result.hfResult?.recommendation}</p>
    <p>
    Compatibility Score:
      <b> {result.hfResult?.compatibilityScore}%</b>
    </p>
    <p>Reason: {result.hfResult?.reason}</p>
  </div>
)}
  </>
)}


{activeTab === "history" && (
  <>

{history.length > 0 && (
  <div
    style={{
      marginTop: "30px",
      padding: "25px",
      borderRadius: "20px",
      backgroundColor:"white",
      
    }}
  >
    <h2
    style={{
      color: "#2563eb",
      marginBottom: "15px",
    }}
    >
      📜 Upload History
      </h2>

    {history.map((item, index) => (
      <div key={index}
      style={{
        padding: "10px",
        margin: " 10px 0",
        backgroundColor: "#f3f4f6",
        borderRadius: "10px",
      }}
      >
        Hairstyle: {item.hairstyle}
      </div>
    ))}
  </div>
)}


<button
  onClick={() => {
    setHistory([]);
    localStorage.removeItem("history");
  }}
  style={{
    backgroundColor: "#dc2626",
    color: "white",
    border: "none",
    padding: "12px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    marginTop: "20px",
  }}
>
  Clear History
</button>
<br/>
<br/>




<div 
style={{
  backgroundColor:"white",
  padding:"20px",
  borderRadius:"15px",
  marginTop:"20px",
}}
>

<h2> 🎯 Detection History</h2>

<h3> Detection Result : {detectionHistory.length}</h3>
{detectionHistory.map((item,index)=>(
  <div
  key={index}    
  style={{
  
  backgroundColor:"white",
  padding:"20px",
  borderRadius:"15px",
  marginTop:"20px",
    }}
    >
    <p>Face Shape: {item.shape}</p>
    <p>Confidence:{item.confidence}%</p>
    </div>
))
}
</div>

<br/>
<br/>

<button
  onClick={() => {
    setDetectionHistory([]);
    localStorage.removeItem("detectionHistory");
  }}
  style={{
    backgroundColor: "#dc2626",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    marginTop: "10px",
  }}
>
  Clear Detection History
</button>
<br/>
<br/>

<div 
style={{
  backgroundColor:"white",
  padding:"20px",
  borderRadius:"15px",
}}
>
<div
  style={{
  backgroundColor:"white",
  padding:"20px",
  borderRadius:"15px",
  
  }}
>
  <h3>💇 Hairstyle Advisor </h3>
  <p>
    Find hairstyles that match your face shape.
  </p>
  <p>
    Version 1.0
  </p>
</div>
</div>
</>
)}
</div>
);
}



