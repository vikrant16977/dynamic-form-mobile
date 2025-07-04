import React, { createContext, useState, useEffect } from "react";

export const FormContext = createContext();

export const FormProvider = ({ children }) => {
  const [forms, setForms] = useState([]);
  const [selectedFormId, setSelectedFormId] = useState(null);

  useEffect(() => {
    // For demo/sample purposes. Remove or modify localStorage for React Native if needed.
    const sampleForm = {
      id: 9999,
      title: "Contractor Performance",
      sections: [
        {
          id: "sec1",
          sectionTitle: "General Information",
          questions: [
            {
              id: "q1",
              label: "Job Task - Select primary job type from dropdown menu",
              type: "dropdown",
              options: [
                "Excavation",
                "Welding",
                "Electrical",
                "Inspection",
                "Other",
              ],
              required: true,
            },
            {
              id: "q2",
              label: "Contractor Rep – Name of contractor representative",
              type: "text",
              required: true,
            },
            {
              id: "q3",
              label: "Company - Select contractor being reviewed",
              type: "dropdown",
              options: ["ABC Ltd.", "XYZ Corp.", "Delta Services", "Other"],
              required: true,
            },
            {
              id: "q4",
              label: "Date – Observation or form completion date",
              type: "date",
              required: true,
            },
            {
              id: "q5",
              label: "Start Time",
              type: "time",
              required: true,
            },
            {
              id: "q6",
              label: "End Time",
              type: "time",
              required: true,
            },
            {
              id: "q7",
              label: "High Pressure – Select Yes or No",
              type: "radio",
              options: ["Yes", "No"],
              required: true,
            },
            {
              id: "q8",
              label: "Work Order Number",
              type: "text",
              required: true,
            },
            {
              id: "q9",
              label: "Crew Size",
              type: "number",
              required: true,
            },
          ],
        },
        {
          id: "sec2",
          sectionTitle: "Performance Observations",
          questions: [
            {
              id: "q10",
              label: "Were work permits followed correctly?",
              type: "radio",
              options: ["Yes", "No", "N/A"],
              required: true,
            },
            {
              id: "q11",
              label: "Was PPE worn appropriately?",
              type: "radio",
              options: ["Yes", "No", "N/A"],
              required: true,
            },
            {
              id: "q12",
              label: "Tools and equipment in good condition?",
              type: "radio",
              options: ["Yes", "No", "N/A"],
              required: true,
            },
            {
              id: "q13",
              label: "Was the work area kept clean?",
              type: "radio",
              options: ["Yes", "No", "N/A"],
              required: true,
            },
            {
              id: "q14",
              label: "Was job site communication effective?",
              type: "radio",
              options: ["Yes", "No", "N/A"],
              required: true,
            },
            {
              id: "q15",
              label: "Was job completed safely?",
              type: "radio",
              options: ["Yes", "No", "N/A"],
              required: true,
            },
            {
              id: "q16",
              label: "Any hazards identified?",
              type: "radio",
              options: ["Yes", "No", "N/A"],
              required: true,
            },
            {
              id: "q17",
              label: "Additional safety observations",
              type: "textarea",
              required: false,
            },
          ],
        },
        {
          id: "sec3",
          sectionTitle: "Comments and Signatures",
          questions: [
            {
              id: "q18",
              label: "Evaluator Comments",
              type: "textarea",
              required: false,
            },
            {
              id: "q19",
              label: "Follow-up Required?",
              type: "radio",
              options: ["Yes", "No"],
              required: true,
            },
            {
              id: "q20",
              label: "Signature of Evaluator",
              type: "text",
              required: true,
            },
            {
              id: "q21",
              label: "Date of Evaluation",
              type: "date",
              required: true,
            },
          ],
        },
      ],
    };

    setForms([sampleForm]);
    setSelectedFormId(sampleForm.id);
  }, []);

  const addNewForm = (title) => {
    const newForm = { id: Date.now(), title, sections: [] };
    setForms((f) => [...f, newForm]);
    setSelectedFormId(newForm.id);
  };

  const addSectionToForm = (formId, section) => {
    setForms((f) =>
      f.map((fm) =>
        fm.id === formId ? { ...fm, sections: [...fm.sections, section] } : fm
      )
    );
  };

  const addQuestionToForm = (formId, sectionId, question) => {
    setForms((f) =>
      f.map((fm) => {
        if (fm.id !== formId) return fm;
        return {
          ...fm,
          sections: fm.sections.map((sec) =>
            sec.id === sectionId
              ? { ...sec, questions: [...sec.questions, question] }
              : sec
          ),
        };
      })
    );
  };

  const updateSelectedFormId = (id) => setSelectedFormId(id);
  const getSelectedForm = () => forms.find((fm) => fm.id === selectedFormId);

  return (
    <FormContext.Provider
      value={{
        forms,
        addNewForm,
        addSectionToForm,
        addQuestionToForm,
        updateSelectedFormId,
        getSelectedForm,
        selectedFormId,
        setForms,
      }}
    >
      {children}
    </FormContext.Provider>
  );
};
