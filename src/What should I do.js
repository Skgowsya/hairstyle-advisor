What should I do 
look i was not get the backend here but i found the backend in the file explorer after writing the mkdir commands so i opened the backend folder another time but after doing this i can get the conynect the backend onl
look it is telling this one
 look i pastedthe backend
my folder is like that one only
it is printing like this
look at this picture
it is cmoing like this
the output is coming like this
i am getting like this
it is showing like this 
Nothing apears
Is there any error in the preview app 
how it is looking should i change any ui 
can you suggest ui
I am not adding there but it is showing me the error 
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
const [tryOnImage, setTryOnImage] = useState("");
const [tryOnLoading, setTryOnLoading] = useState(false);
const [result, setResult] = useState(null);
const imageRef=useRef(null);


const hairstyles = [
{ name: "Fade Cut", image: fade, category:"Men" },
{ name: "Buzz Cut", image: buzz, category:"Men"},
{ name: "Crew Cut", image: crew, category:"Men" },
{ name: "French Crop", image: frenchcrop, category:"Men"},
{ name: "Pompadour", image: Pompadour, category:"Men" },
{ name: "Undercut", image: under, category:"Men" },

{name:"curtainbags cut", image: curtainbags, category:"Women"},
{name:"longlayers cut", image: longlayers, category:"Women"},
{name:"pixie cut", image: pixie, category:"Women"},
{name:"wolf cut", image: wolf, category:"Women"},
{name:"bob", image: bob, category:"Women"},
{name:"butterfly cut", image: butterfly, category:"Women"},

];

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
  const response = await fetch("/upload", {
    method: "POST",
    body: formData,
  });

  const data = await response.json();


  if (data.success) {
    
    setMessage(
      Upload successful! Hairstyle: ${data.hairstyle}
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
if (!file || !hairstyle) {

setPreviewMessage("Please upload a photo and select an hairstyle");
return;
}

setLoading(true);

try {
  const response = await axios.post("http://localhost:5000/generate-preview");

  const data = await response.data;

  if (data.success) {
    setGeneratedStyle(hairstyle);

    setPreviewMessage(data.message);
    setMessage(
      Uplaoded successful! hairstyle : ${hairstyle}
    );
    setHistory((prev) => [
  ...prev,
  {
    hairstyle: hairstyle,
    filename: data.filename,
  },
]);
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
      await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
      await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
      console.log("Models loaded");
    } catch (err) {
      console.error("Model loading error:", err);
    }
  };

  loadModels();
}, []);



const handleAnalyze = async () => {
  if(!imageRef.current){
    alert("Please upload an image first");
    return;
  }
  
  const img = imageRef.current;

  console.log("Image src:", imageRef.current?.src);
  
  const result = await detectFaceShape(img);
  console.log(result);
  if(!result){
    setFaceShape("No face Detected");
    return;
  }

  setFaceShape(result);
  setDetectedFaceShape(result);
  setConfidence(95);
  await analyzeWithAI(preview,result);
};

const detectFaceShape = async (img) => {
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

  const jawLeft = jaw[0];
  const jawRight = jaw[16];
  const chin = jaw[8];

  // Forehead estimate
  const foreheadLeft = leftBrow[0];
  const foreheadRight = rightBrow[4];

  const faceWidth = Math.abs(
    jawRight.x - jawLeft.x
  );

  const foreheadWidth = Math.abs(
    foreheadRight.x - foreheadLeft.x
  );

  const browY =
    (leftBrow[2].y + rightBrow[2].y) / 2;

  const faceLength = Math.abs(
    chin.y - browY
  );

  const lengthWidthRatio =
    faceLength / faceWidth;

  console.log("Face Width:", faceWidth);
  console.log("Forehead Width:", foreheadWidth);
  console.log("Face Length:", faceLength);
  console.log("Ratio:", lengthWidthRatio);

  // Oval
  if (
    lengthWidthRatio > 1.35 &&
    foreheadWidth >= faceWidth * 0.85
  ) {
    return "Oval";
  }

  // Round
  if (
    lengthWidthRatio < 1.2 &&
    Math.abs(faceWidth - foreheadWidth) <
      faceWidth * 0.15
  ) {
    return "Round";
  }

  // Square
  if (
    lengthWidthRatio < 1.25 &&
    foreheadWidth >= faceWidth * 0.9
  ) {
    return "Square";
  }

  // Heart
  if (
    foreheadWidth > faceWidth * 0.95
  ) {
    return "Heart";
  }

  // Diamond
  if (
    foreheadWidth < faceWidth * 0.8
  ) {
    return "Diamond";
  }

  return "Oval";
};

const handleDetect = async () => {
  if(!imageRef.current){
    alert("Upload image first");
    return;
  }
  const detection = await detectFaceShape(img);

  const faceShape = detection || "unknown";

  // Convert image to base64 OR use uploaded image state
  const imageBase64 = preview;

  await analyzeWithAI(imageBase64, faceShape);
};

const analyzeWithAI = async (imageBase64, detectedFaceShape) => {
  try {
    setLoading(true);

    const response = await fetch("http://localhost:5000/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image: imageBase64,
        faceShape: detectedFaceShape,
      }),
    });

    const data = await response.json();

    console.log("AI RESULT:", data);

    setResult(data);
  } catch (error) {
    console.log("ERROR:", error);
  } finally {
    setLoading(false);
  }
};

const filteredStyles = hairstyles
  .filter((style) => style.category === category)
  .filter((style) =>
    style.name.toLowerCase().includes(search.toLowerCase())
  );

const recommendations = {
  Round: ["Pompadour", "Undercut", "French Crop"],
  Oval: ["Fade Cut", "Crew Cut", "Pompadour"],
  Square: ["Buzz Cut", "Crew Cut", "Undercut"],
  Heart: ["French Crop", "Fade Cut"],
  Diamond: ["Pompadour", "Undercut"],
};

const copyBarberCard=()=>{
  navigator.clipboard.writeText(
    I want a ${hairstyle} hairstyle.Please keep the style similar to the preview.
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

const menRecommendations={
  Round:["Pompadour","Undercut","French Crop"],
  Oval:["Fade Cut","Crew Cut","Pompadour"],
  Square:["Buzz Cut","Crew Cut","Undercut"],
  Heart:["French Crop","Fade Cut"],
  Diamond:["Pompadour","Undercut"],
};

const womenRecommendations={
  Round:["longlayers cut","curtainbags cut","butterfly cut"],
  Oval:["bob","butterfly cut","longlayers cut"],
  Square:["wolf cut","longlayers Cut","curtainbags cut"],
  Heart:["bob","butterfly cut"],
  Diamond:["butterfly cut","pixie cut","bob"],
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

const analyzeFaceShape = async () => {
  console.log("Button clicked")
  try {
    const response = await fetch(
      "http://localhost:5000/analyze",
      {
        method: "POST",
        headers:{
        "Content-Type":"application/json"
        },
        body:JSON.stringify({faceShape:faceShape}) 
      }
  );
    const data = await response.json();
    console.log("Responce data : ",data);
    setDetectedFaceShape(data.faceShape);
    setFaceShape(data.faceShape);
    setConfidence(data.confidence);
  setDetectionHistory((prev) => [
    ...prev,
  {
    shape: faceShape,
    confidence: 95,
  },
  ]);
} catch(error){
  console.log(error);
}
};

const sendToHF = async (base64Image) => {
  const res = await fetch("http://localhost:5000/analyze", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ image: base64Image }),
  });

  const data = await res.json();
  console.log("HF result:", data);
};

const finalResult = {
  faceApiShape: "Oval",
  hfPrediction: "Possible Oval / Round",
  confidence: "87%",
  recommendation: "Fade cut + textured top"
};


return (
<div
style={{
maxWidth: "1000px",
margin: "auto",
textAlign: "center",
padding: "20px",
background: "linear-gradient(135deg, #667eea, #764ba2)",
minHeight: "100vh",
borderRadius: "15px",

}}
>
<h1
style={{
color: "#1a44fe",
fontSize: "32px",
marginBottom:"20px",
}}
>
  Hairstyle Preview App
</h1>

  <input
    type="file"
    accept="image/*"
    onChange={handleFileChange}
  />

  <br />
  <br />

  {preview && (
    
    <div
  style={{
    position: "relative",
    display: "inline-block",
  }}
>
  <img
  ref={imageRef}
    src={preview}
    alt="user"
    width="300"
    
  />

</div>   
  
)}   
    
  <br/>
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
    bordeRadius:"10px",
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

      <br />
      <br />

      </div>

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
         border: "none",
         fontSize:"16px",
  }}
/>
<br />
<br />
<h2>Hair Goal</h2>
   <select
   value={hairGoal}
   onChange={(e)=>
    setHairGoal(e.target.value)}
    style={{
      
      padding:"10px",
      borderRadius:"10px",
      marginBottom:"20px",
    }}
    >
      <option value="">Select Goal</option>
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
      boxShadow:"0 4px 10px rgba(0,0,0,0,2)",
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
    {faceShape && (
  <div
    style={{
      backgroundColor: "white",
      padding: "15px",
      borderRadius: "10px",
      margin: "20px auto",
      maxWidth: "400px",
    }}
  >
    
    <h3
  style={{
    color: "#2563eb",
    marginBottom: "15px",
  }}
>
  🎯 Recommended Hairstyles
</h3>

    {(recommendations[faceShape]||[]).map((style, index) => (
      <p key={index}>✅ {style}</p>
    ))}
  </div>
)}

<br/>

<button onClick={handleAnalyze}>
  Auto Detect Face
  
</button>
<p>Face Detected : {faceShape}</p>
<br/>

<button onClick={analyzeFaceShape}>
  Analyze Face Shape 
</button>

<br/>

{detectedFaceShape &&(
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
    <h2> Detection Result</h2>
    <p>
      Face Shape:<b>{detectedFaceShape}</b>
    </p>
    <p>
      Confidence: <b>{confidence}%</b>
    </p>
    <p>
      Recommendations updated automatically.
    </p>
    </div>
)}
<br/>


<h2> Detection History</h2>
<p>History Count : {detectionHistory.length}</p>
{detectionHistory.map((item,index)=>(
  <div
  key={index}
  style={{
    backgroundColor:"white",
    padding:"10px",
    margin:"10px",
    borderRadius:"10px",
  }}
  >
    <p>Face Shape: {item.shape}</p>
    <p>Confidence:{item.confidence}%</p>
    </div>
))
}

<br/>

<button 
onClick={findBestHairStyle}

style={{
  backgroundColor:"#8b5cf6",
  color:"white",
  border:"none",
  padding:"12px 20px",
  borderRadius:"10px",
  cursor:"pointer",
}}  
>
  Find My Best Hairstyle
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

  <button 
  onClick={getAdvisorAdvice}
  style={{
    marginLeft:"10px",
    backgroundColor:"#10b981",
    color:"white",
    border:"none",
    padding:"12px 20px",
    borderRadius:"10px",
    cursor:"pointer",
  }} 
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
      alt={item}
      width="150"
      height="150"
      style={{
        objectFit:"cover",
        borderRadius:"10px",
      }}
      />
      <h4>{item}</h4>
      <p
      style={{
        color:"green",
        fontWeight:"bold",
      }}
      >
        Match Score : {95 - index*5}%
      </p>
      </div>
    );
})}
</div>
</div>
  )}
  <br/>
  <br/>
  <h2>⚖️ Compare Hairstyles</h2>

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
      display: "flex",
      justifyContent: "center",
      gap: "20px",
      marginTop: "20px",
    }}
  >
    <div>
      <img
        src={
          hairstyles.find(
            (s) => s.name === compareStyle1
          )?.image
        }
        width="150"
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
        width="165"
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

  <br/>
  <br/>

  
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
          faceShape==="Diamond"&&
          (style.name==="Pompadour" || style.name==="Undercut")
        ) {
          setMatchScore("95%");
        }else{
          setMatchScore("75%");
        }
        }}

        style={{
          border:
            hairstyle === style.name
              ? "3px solid blue"
              : "1px solid gray",
          borderRadius: "10px",
          padding: "10px",
          cursor: "pointer",
          backgroundColor: "white",
          boxShadow: "0.4px 10px rgba(0,0,0,0.5)",
          transition: "0.3s",
        }}
      >
        <img
          src={style.image}
          alt={style.name}
          width="180"
          height="180"
          style={{
            objectFit: "cover",
            borderRadius: "10px",
          }}
        />

        <p>{style.name}</p>

         {faceShape &&

           recommendations[faceShape]?.includes(style.name) && (
         <p
              style={{
                backgroundColor:"#dcfce7",
                color: "#166534",
                padding:"5px",
                borderRadius:"10px",
                fontWeight:"bold",
               fontSize: "14px",
                 
              }}
              >
              ⭐ Recommended
                  </p>
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
  ❤️ Favorite
</button>
      </div>
    ))
  )}
  
  <h3>favrorites count:{favorites.length}</h3>
  </div>
      {hairstyle && ( 
        <div
        style={{
          backgroundColor:"white",
          padding:"20px",
          borderRadius:"15px",
          margin:"20px auto",
          maxwidth:"400px",
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
        </div>
      )}
      {hairstyle && (
        <div
        style={{
          backgroundColor:"white",
          padding:"20px",
          borderRadius:"15px",
          margin:"20px 15px",
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

      {matchScore &&(
        <div
        style={{
          backgroundColor:"white",
          padding:"15px",
          borderRadius:"15px",
          margin:"20px auto",
          maxWidth:"350px",
        }}
        >
          <h3>Match Score: {matchScore}</h3>
          </div>
      )}

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
  Upload Image
</button>

  <button
  onClick={generatePreview}
  style={{
    marginLeft: "10px",
    backgroundColor: "#16a34a",
    color: "white",
    border: "none",
    padding: "12px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
  }}
>
  Generate Preview
</button>

  <br />
  <br />

  <h2>{message}</h2>

  <h3>{previewMessage}</h3>

  {loading && (
    <h3>Generating Preview...</h3>
  )}

  {generatedStyle && (
    <div
      style={{
        marginTop: "30px",
        padding: "25px",
        borderRadius: "20px",
        backgroundColor: "white",
        boxShadow: "0 8px 20px rgba(0,0,0,0.3)"
      }}
    >
    
      <h2
      style={{
        color:"#2563eb",
        marginBottom: "15px",
      }}
      >
      Preview Result</h2>

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

    <p>
      Confidence:
      <b> {result.localResult?.confidence}%</b>
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

<div
style={{
  backgroundColor:"white",
  padding:"15px",
  borderRadius:"15px",
  width:"250px",
  margin:"20px auto",
  boxShadow: "0 4px 10px rgba(0,0,0,0.2)",

}}
>
<h2>Total Uploads: {history.length}</h2>
</div>

{history.length > 0 && (
  <div
    style={{
      marginTop: "30px",
      padding: "25px",
      borderRadius: "20px",
      backgroundColor: "white",
      boxShadow: "0 8px 20px rgba(0,0,0,0.3)"
    }}
  >
    <h2
    style={{
      color: "#2563eb",
      marginBottom: "15px",
    }}
    >
      Upload History
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
  <h3>Growth Reords:{growthHistory.length}</h3>
  <h2>Hair Growth Timeline </h2>
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

<div
style={{
  backgroundColor:"white",
  padding:"20px",
  borderRadius:"15px",
  marginTop: "20px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.2)"
}}
>
<h2>❤️ Favorite Hairstyles</h2>

{favorites.length === 0 ? (<p style={{color:"#dc2626",fontSize:"18px",fontWeight:"bold",}}>No favorites yet</p>) : (favorites.map((item, index) => (
    <div key={index}>
      {item}
    </div>
  ))
)}
</div>
<div
  style={{
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "15px",
    marginTop: "20px",
  }}
>
  <h2>🌱 Hair Growth Timeline</h2>

  {growthHistory.length === 0 ? (
    <p>No growth records yet</p>
  ) : (
    growthHistory.map((item) => (
      <div key={item.month}>
        <h4>Month {item.month}</h4>

        <img
          src={item.image}
          width="150"
          style={{ borderRadius: "10px" }}
        />
      </div>
    ))
  )}
</div>

</div>
);
}
