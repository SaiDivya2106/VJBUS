import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeProvider";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Problems from "./pages/Problems";
import ProblemDetail from "./pages/ProblemDetail";
import UpdateProblemForm from "./pages/UpdateProblemForm";
import Ideas from "./pages/Ideas";
import IdeaDetail from "./pages/IdeaDetail";
import Startups from "./pages/Startups";
import StartupDetail from "./pages/StartupDetail";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

// Import UserProvider
import { UserProvider } from "../src/pages/UserContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {/* Wrap the entire app with UserProvider */}
        <UserProvider>
          <BrowserRouter>
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/problems" element={<Problems />} />
                <Route path="/problems/:id" element={<ProblemDetail />} />
                <Route path="/update-problem/:id" element={<UpdateProblemForm />} />
                <Route path="/ideas" element={<Ideas />} />
                <Route path="/ideas/:id" element={<IdeaDetail />} />
                <Route path="/startups" element={<Startups />} />
                <Route path="/startups/:id" element={<StartupDetail />} />
                <Route path="/login" element={<Login />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </BrowserRouter>
        </UserProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
