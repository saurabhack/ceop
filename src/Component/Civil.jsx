// src/StudentSearch.js
import React, { useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import students from "./studentsdatacivil";
import 'animate.css';


function Civil() {
  const [misInput, setMisInput] = useState("");
  const [result, setResult] = useState(null);
  const [showDownloadBtn, setShowDownloadBtn] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const input = e.target.value;
    if (/^\d*$/.test(input) && input.length <= 9) {
      setMisInput(input);
      setError("");
    } else {
      setError("MIS number must be up to 9 digits.");
    }
  };

  const searchStudent = () => {
    if (misInput.length === 0 || misInput.length > 9) {
      setError("MIS number must be up to 9 digits.");
      return;
    }
    const student = students.find((stud) => stud.misNo === misInput.trim());

    if (student) {
      setResult(student);
      setShowDownloadBtn(true);
      setError("");
    } else {
      setResult({ error: `No student found with MIS No: ${misInput}` });
      setShowDownloadBtn(false);
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    const { studentName, cgpa, sgpa, subjects } = result;

    doc.setFontSize(18);
    doc.text("Student Report", 20, 10);

    doc.setFontSize(12);
    doc.text(`Name: ${studentName}`, 20, 20);
    doc.text(`CGPA: ${cgpa}`, 20, 30);
    doc.text(`SGPA: ${sgpa}`, 20, 40);

    doc.autoTable({
      head: [["Subject Code", "Grade", "Pointer"]],
      body: subjects.codes.map((code, index) => [
        code,
        subjects.grades[index],
        subjects.pointers[index],
      ]),
      startY: 60,
    });

    doc.save("Student_Subjects.pdf");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center" style={{ backgroundImage: `url(college_42b626c32aa4436806a3282d3c6469b5.jpg)` }}>
      <div className="w-full max-w-md md:max-w-lg lg:max-w-xl bg-white p-4 md:p-6 mt-5 rounded-lg shadow-md text-center animate__animated animate__fadeInDown animate__slow	2s">
        <div className="mb-4">
          <h1 className="text-center">
            <img src="coep_logoBlack.png" alt="COEP" className="mx-auto"/>
          </h1>
          <h2 className="text-lg md:text-xl lg:text-2xl font-semibold">COEP Technological University</h2>
        </div>
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4">Civil Student Information</h1>
        <div className="mb-4">
          <input
            type="text"
            id="misInput"
            placeholder="Enter MIS No"
            value={misInput}
            onChange={handleInputChange}
            className="p-2 border border-gray-300 rounded w-full sm:w-3/4 mb-2 text-sm md:text-base"
          />
          {error && <p className="text-red-500 text-sm md:text-base">{error}</p>}
          <button onClick={searchStudent} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm md:text-base">
            Search
          </button>
          {showDownloadBtn && (
            <button
              id="downloadBtn"
              onClick={downloadPDF}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 mt-2 text-sm md:text-base"
            >
              Download PDF
            </button>
          )}
        </div>

        {result && (
          <div id="result" className="mt-4 p-4 border border-gray-300 rounded bg-gray-50">
            {result.error ? (
              <p>{result.error}</p>
            ) : (
              <>
                <h2 className="text-lg md:text-xl lg:text-2xl font-bold">NAME: {result.studentName}</h2>
                <h3 className="font-semibold">CGPA: {result.cgpa}</h3>
                <h3 className="font-semibold">SGPA: {result.sgpa}</h3>
                <h3 className="font-semibold">Subjects:</h3>
                <table id="subjectsTable" className="w-full border-collapse mt-4 text-sm md:text-base">
                  <thead>
                    <tr>
                      <th className="border p-2 bg-gray-200">Subject Code</th>
                      <th className="border p-2 bg-gray-200">Grade</th>
                      <th className="border p-2 bg-gray-200">Pointer</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.subjects.codes.map((code, index) => (
                      <tr key={index}>
                        <td className="border p-2">{code}</td>
                        <td className="border p-2">{result.subjects.grades[index]}</td>
                        <td className="border p-2">{result.subjects.pointers[index]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Civil;
