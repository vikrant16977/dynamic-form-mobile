import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomePage from "./pages/HomePage";
import AdminPage from "./pages/AdminPage";
import UserPage from "./pages/UserPage";
import { FormProvider } from "./context/FormContext";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <FormProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomePage} />
          <Stack.Screen name="Admin" component={AdminPage} />
          <Stack.Screen name="Form" component={UserPage} />
        </Stack.Navigator>
      </NavigationContainer>
    </FormProvider>
  );
}
