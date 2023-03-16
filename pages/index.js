import { useState } from 'react';
import * as pdfjsLib from "pdfjs-dist";

const Home = () => {
  const [userInput, setUserInput] = useState('');

  const [apiOutput, setApiOutput] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const callGenerateEndpoint = async () => {
    setIsGenerating(true);
    
    console.log("Calling API...")
    const response = await fetch('/api/summarize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userInput }),
    });

    const data = await response.json();
    const { output } = data;
    console.log("API replied...")
    console.log(output);

    setApiOutput(`${output}`);
    setIsGenerating(false);
  }

  const loadPdf = async (event) => {
    pdfjsLib.GlobalWorkerOptions.workerSrc = window.location.origin + '/pdf.worker.min.js';;
    const pdfFile = event.target.files[0];
    const data = await pdfFile.arrayBuffer();

    const pdf = await pdfjsLib.getDocument({ data : data}).promise;
    const numPages = pdf.numPages;
    const pagePromises = [];
  
    // Collect promises to extract text from each page
    for (let i = 1; i <= numPages; i++) {
      pagePromises.push(pdf.getPage(i));
    }
  
    // Extract text from each page
    const pages = await Promise.all(pagePromises);
    const pageTextPromises = pages.map(async (page) => {
      const textContent = await page.getTextContent();
      return textContent.items.map((item) => item.str).join(' ');
    });
  
    // Concatenate all page text into a single string
    const pageTexts = await Promise.all(pageTextPromises);
    setUserInput(pageTexts.join(' '));
  };

  const onUserChangedText = (event) => {
    setUserInput(event.target.value);
  };

  const copyAction = () => {
    // Get the text field
    var copyText = document.getElementById("summary");

    // Copy the text inside the text field
    navigator.clipboard.writeText(copyText.innerText);

    // Alert the copied text
    alert("Copied to the clipboard successfully !");
  }

  return (
    <div className="root">
      <div className="container">
        <div className="header">
          <div className="header-title">
            <h1>Summary Generator</h1>
          </div>
          <div className="header-subtitle">
            <h2>
              No time to read a long article ? But you have to write a summary for it ?
            </h2>
          </div>
        </div>
      </div>
      <div className='container'>
        <h2 className='subtitle'>
          Copy that long article below and get your summary now!
        </h2>
        <div className='pdf-container'>
          <label className='pdf-label'>Or import a pdf text here :</label>
          <input className="pdf-box" type="file" onChange={loadPdf} accept=".pdf"/>
        </div>
        <div className="prompt-container">
            <textarea placeholder="Copy the document here" className="prompt-box" value={userInput}
            onChange={onUserChangedText} />
        </div>
        <div className="prompt-buttons">
          <a
            className='generate-button'
            onClick={callGenerateEndpoint} href="#output"
          >
            <div className="generate">
              Summarize
            </div>
          </a>
        </div>
      </div>
      <div className='container'>
        <div className="output" id="output">
          <div className="output-header-container">
            <div className="output-header">
              <h3>Output</h3>
            </div>
          </div>
          <div className="output-content">
            <button onClick={copyAction} className='copy'><img src="https://img.icons8.com/external-outline-astudio/32/null/external-copy-text-editor-outline-astudio.png"/></button>
            {isGenerating ? <span className="loader"></span> : <p id="summary">{apiOutput}</p>}
            <small>This is generated with the <i>pszemraj/long-t5-tglobal-base-16384-book-summary</i> and <i>facebook/bart-large-cnn</i> models.</small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
