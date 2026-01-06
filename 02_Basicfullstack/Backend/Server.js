import express from "express";

const app = express();

let Data =[ {
    id: 1,
    title: "Getting Started",
    text: "This section explains how to begin and understand the basics."
  },
  {
    id: 2,
    title: "Installation",
    text: "Steps required to install the application and set up dependencies."
  },
  {
    id: 3,
    title: "Core Concepts",
    text: "Covers the fundamental concepts you need to know."
  },
  {
    id: 4,
    title: "Usage",
    text: "Demonstrates how to use the features with examples."
  },
  {
    id: 5,
    title: "Best Practices",
    text: "Tips and guidelines to write clean and efficient code."
  },
  {
    id: 6,
    title: "Conclusion",
    text: "A brief summary and next steps for learning."
  }
];

app.get('/',(req,res)=>{
    res.send('Server in backend')
})

app.get('/api/Data',(req,res)=>{
    res.send(Data)
})

const port = process.env.PORT || 4000 ;

app.listen(port,()=>{
    console.log(`server at ${port}`);
    
})