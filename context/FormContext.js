import React, { createContext, useState, useEffect, useRef } from "react";
import axios from "axios";

export const FormContext = createContext();

export const FormProvider = ({ children }) => {
  const [forms, setForms] = useState([]);
  const [selectedFormId, setSelectedFormId] = useState(null);
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef(null);

  // Function to fetch forms from backend
  const fetchForms = async () => {
    try {
      const response = await axios.get('https://dynamic-form-mobile-noktwd7ra-vikrant-ahers-projects.vercel.app/api/forms', {
  headers: {
    'User-Agent': 'Mozilla/5.0',
    // Add any other headers if needed
  }
});
      const data = response.data;
      console.log("Fetched data:", data);

      // Defensive check for backend response shape
      if (!data || !Array.isArray(data.value)) {
        console.error("Unexpected API response:", data);
        setForms([]);
        setLoading(false);
        return;
      }

      const formsFetched = [];
      for (const item of data.value) {
        let parsedForms = [];
        try {
          let cleanStr = item.schema;
          if (cleanStr.startsWith('"') && cleanStr.endsWith('"')) {
            cleanStr = cleanStr.slice(1, -1);
          }
          cleanStr = cleanStr.replace(/""/g, '"');
          parsedForms = JSON.parse(cleanStr);
          if (Array.isArray(parsedForms)) {
            formsFetched.push(...parsedForms);
          } else {
            formsFetched.push(parsedForms);
          }
        } catch (e) {
          console.error("Failed to parse form schema:", e);
        }
      }
      setForms(formsFetched);
      if (formsFetched.length > 0) setSelectedFormId(formsFetched[0].id);
    } catch (error) {
      console.error("Failed to fetch forms:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForms(); // Initial fetch

    // Set up interval to fetch every 15 seconds
    intervalRef.current = setInterval(() => {
      fetchForms();
    }, 60000);

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
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
        loading,
      }}
    >
      {children}
    </FormContext.Provider>
  );
};