import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Upload, X, UserPlus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { stageLabels } from "@/data/mockData";
import axios from "axios";
import { useUser } from "@/pages/UserContext";

interface TeamMember {
  name: string;
  email: string;
  role: string;
  image: File | null;
}

interface IdeaFormData {
  title: string;
  description: string;
  problemId: string;
  stage: number;
  mentor: string;
  contact: string;
  titleImage: FileList | null;
  teammates: TeamMember[];
}

const IdeaSubmissionForm = () => {
  const [open, setOpen] = useState(false);
  const [teamImagePreviews, setTeamImagePreviews] = useState<{ [key: number]: string }>({});
  const [titleImagePreview, setTitleImagePreview] = useState<string | null>(null);
  const [problems, setProblems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useUser();
  
  // Fetch problems from backend
  useEffect(() => {
    const fetchProblems = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/problem-api/problems`);
        setProblems(response.data);
      } catch (error) {
        console.error("Error fetching problems:", error);
        toast({
          title: "Error loading problems",
          description: "Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchProblems();
  }, []);
  
  const { register, handleSubmit, reset, control, watch, formState: { errors, isSubmitting } } = useForm<IdeaFormData>({
    defaultValues: {
      teammates: [{ name: "", email: "", role: "", image: null }],
      stage: 0 // Default to "Ideation" (index 0)
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "teammates"
  });

  const onSubmit = async (data: IdeaFormData) => {
    try {
      const formattedTeam = data.teammates.map((teammate, index) => ({
        name: teammate.name,
        email: teammate.email,
        role: teammate.role,
        // We'll handle image upload separately in a production app
      }));
      
      // Create a FormData object to send files
      const formData = new FormData();
      
      // Append text data
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('relatedProblemId', data.problemId);
      formData.append('stage', String(data.stage || 1));
      formData.append('mentor', data.mentor || '');
      formData.append('contact', data.contact);
      formData.append('addedByName', user?.name || "Anonymous User");
      formData.append('addedByEmail', user?.email || "anonymous@example.com");
      formData.append('team', JSON.stringify(formattedTeam));
      formData.append('tags', JSON.stringify(["New Idea"]));
      
      // Append title image if available
      if (data.titleImage && data.titleImage[0]) {
        formData.append('titleImage', data.titleImage[0]);
      }
      
      // Send data to backend
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/idea-api/idea`, 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      if (response.status === 201) {
        toast({
          title: "Idea submitted successfully!",
          description: "Your idea has been submitted for review.",
        });
        
        reset();
        setTeamImagePreviews({});
        setOpen(false);
        
        // Force a reload of ideas data if we're on the ideas page
        if (window.location.pathname.includes('/ideas')) {
          window.location.reload();
        }
      }
    } catch (error) {
      console.error("Error submitting idea:", error);
      toast({
        title: "Submission failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handleTitleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setTitleImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeTitleImage = () => {
    setTitleImagePreview(null);
  };

  const handleTeamImageUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setTeamImagePreviews(prev => ({
          ...prev,
          [index]: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeTeamImage = (index: number) => {
    setTeamImagePreviews(prev => {
      const newPreviews = { ...prev };
      delete newPreviews[index];
      return newPreviews;
    });
  };

  const addTeammate = () => {
    append({ name: "", email: "", role: "", image: null });
  };

  const removeTeammate = (index: number) => {
    remove(index);
    removeTeamImage(index);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white border-0">
          <Plus className="w-4 h-4 mr-2" />
          Submit Idea
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-green-600">Submit a New Idea</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Idea Title *</Label>
              <Input 
                id="title"
                {...register("title", { required: "Title is required" })}
                placeholder="Enter your idea title"
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
            </div>

            <div>
              <Label htmlFor="problemId">Related Problem *</Label>
              <Select onValueChange={(value) => register("problemId").onChange({ target: { value } })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a problem" />
                </SelectTrigger>
                <SelectContent>
                  {loading ? (
                    <SelectItem value="loading" disabled>Loading problems...</SelectItem>
                  ) : (
                    problems.map((problem) => (
                      <SelectItem key={problem.problemId} value={problem.problemId}>
                        {problem.title}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {errors.problemId && <p className="text-red-500 text-sm mt-1">Please select a problem</p>}
            </div>
          </div>
          
          {/* Title Image Upload */}
          <div>
            <Label htmlFor="titleImage">Idea Title Image</Label>
            <div className="mt-2 flex items-center gap-4">
              <Input
                id="titleImage"
                type="file"
                accept="image/*"
                {...register("titleImage")}
                onChange={handleTitleImageUpload}
                className="hidden"
              />
              <label
                htmlFor="titleImage"
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-idea-primary/10 text-idea-primary hover:bg-idea-primary/20 cursor-pointer"
              >
                <Upload size={18} />
                <span>Upload Image</span>
              </label>
              
              {titleImagePreview && (
                <div className="relative">
                  <img
                    src={titleImagePreview}
                    alt="Title preview"
                    className="h-16 w-24 object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={removeTitleImage}
                    className="absolute -top-2 -right-2 rounded-full bg-red-500 text-white p-1"
                  >
                    <X size={12} />
                  </button>
                </div>
              )}
              <div className="text-xs text-vj-muted">
                Recommended: 1280x720 or 16:9 aspect ratio
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Idea Description *</Label>
            <Textarea 
              id="description"
              {...register("description", { required: "Description is required" })}
              placeholder="Describe your solution in detail"
              rows={4}
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="stage">Development Stage</Label>
              <Select value="0" onValueChange={() => {}}>
                <SelectTrigger className="opacity-75">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {stageLabels.map((stage, index) => (
                    <SelectItem 
                      key={index} 
                      value={index.toString()}
                      disabled={index !== 0}
                    >
                      {index + 1}. {stage}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <input type="hidden" {...register("stage")} value="0" />
            </div>

            <div>
              <Label htmlFor="mentor">Mentor (Optional)</Label>
              <Input 
                id="mentor"
                {...register("mentor")}
                placeholder="e.g., Dr. Rajesh Kumar - IIT Delhi"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="contact">Contact Phone Number *</Label>
            <Input 
              id="contact"
              type="tel"
              {...register("contact", { 
                required: "Contact phone number is required",
                pattern: {
                  value: /^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$/,
                  message: "Invalid Indian phone number format"
                }
              })}
              placeholder="+91 9XXXXXXXXX"
            />
            {errors.contact && <p className="text-red-500 text-sm mt-1">{errors.contact.message}</p>}
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <Label className="text-lg font-semibold">Team Members</Label>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={addTeammate}
                className="text-green-600 border-green-600 hover:bg-green-50"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Add Member
              </Button>
            </div>
            
            {fields.map((field, index) => (
              <div key={field.id} className="p-4 border border-gray-200 rounded-lg mb-4 bg-gray-50">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">Team Member {index + 1}</h4>
                  {fields.length > 1 && (
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => removeTeammate(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                  <div>
                    <Label>Name *</Label>
                    <Input 
                      {...register(`teammates.${index}.name`, { required: "Name is required" })}
                      placeholder="Full name"
                    />
                  </div>
                  
                  <div>
                    <Label>Email *</Label>
                    <Input 
                      type="email"
                      {...register(`teammates.${index}.email`, { 
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email"
                        }
                      })}
                      placeholder="email@iit.ac.in"
                    />
                  </div>
                  
                  <div>
                    <Label>Role *</Label>
                    <Input 
                      {...register(`teammates.${index}.role`, { required: "Role is required" })}
                      placeholder="e.g., Programmer, UI Designer, ML Engineer"
                    />
                  </div>
                </div>
                
                <div>
                  <Label>Profile Image</Label>
                  <div className="mt-2">
                    {teamImagePreviews[index] ? (
                      <div className="relative inline-block">
                        <img 
                          src={teamImagePreviews[index]} 
                          alt="Preview" 
                          className="w-16 h-16 object-cover rounded-full border"
                        />
                        <button
                          type="button"
                          onClick={() => removeTeamImage(index)}
                          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-16 h-16 border-2 border-dashed border-gray-300 rounded-full cursor-pointer hover:bg-gray-100">
                        <Upload className="w-4 h-4 text-gray-400" />
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => handleTeamImageUpload(index, e)}
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white border-0"
            >
              {isSubmitting ? "Submitting..." : "Submit Idea"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default IdeaSubmissionForm;