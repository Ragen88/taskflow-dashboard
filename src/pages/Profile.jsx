import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/layout/Navbar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getUserProfile, updateUserProfile, saveUserProfile } from "@/utils/userStorage";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function Profile() {
  const { user, isAuthenticated } = useAuth0();
  const navigate = useNavigate();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    nickname: "",
    pictureDataUrl: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  // Load profile data from localStorage or Auth0 user data
  useEffect(() => {
    if (isAuthenticated && user) {
      // First, save Auth0 user data to localStorage if not already saved
      const storedProfile = getUserProfile();
      if (!storedProfile || storedProfile.sub !== user.sub) {
        // Save Auth0 user data to localStorage
        saveUserProfile(user);
        setProfileData(user);
        setFormData({
          name: user.name || "",
          nickname: user.nickname || "",
          pictureDataUrl: "",
        });
      } else {
        // Use stored profile data
        setProfileData(storedProfile);
        setFormData({
          name: storedProfile.name || "",
          nickname: storedProfile.nickname || "",
          pictureDataUrl: storedProfile.pictureDataUrl || "",
        });
      }
    }
  }, [user, isAuthenticated]);

  const auth0Domain = import.meta.env.VITE_AUTH0_DOMAIN;

  const triggerPasswordResetEmail = async () => {
    if (!user?.email) {
      alert("Email address not found. Please contact support.");
      return;
    }

    try {
      // Use Auth0's password reset API to send reset email
      const response = await fetch(`https://${auth0Domain}/dbconnections/change_password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: import.meta.env.VITE_AUTH0_CLIENT_ID,
          email: user.email,
          connection: "Username-Password-Authentication", // Default Auth0 database connection
        }),
      });

      if (response.ok) {
        alert(
          `Password reset email sent to ${user.email}. Please check your inbox and click the link to change your password.`
        );
      } else {
        const error = await response.json();
        console.error("Password reset error:", error);
        alert(
          "Unable to send password reset email. Please use the 'Forgot password?' link on the login page."
        );
      }
    } catch (error) {
      console.error("Error triggering password reset:", error);
      alert(
        "Unable to send password reset email. Please use the 'Forgot password?' link on the login page."
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <div className="flex items-center gap-3 mb-4">
          <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-foreground">Your Profile</h1>

        <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 bg-card text-card-foreground border border-border rounded-xl p-4 sm:p-6">
          <img
            src={profileData?.pictureDataUrl || user?.picture}
            alt={profileData?.name || user?.name}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border border-border object-cover"
          />

          <div className="flex-1 space-y-2">
            <div>
              <div className="text-sm text-muted-foreground">Name</div>
              <div className="text-lg font-medium">{profileData?.name || user?.name}</div>
            </div>

            {(profileData?.email || user?.email) && (
              <div>
                <div className="text-sm text-muted-foreground">Email</div>
                <div className="text-lg">{profileData?.email || user?.email}</div>
              </div>
            )}

            <div>
              <div className="text-sm text-muted-foreground">User ID</div>
              <div className="text-xs break-all">{profileData?.sub || user?.sub}</div>
            </div>

            {(profileData?.nickname || user?.nickname) && (
              <div>
                <div className="text-sm text-muted-foreground">Nickname</div>
                <div className="text-lg">{profileData?.nickname || user?.nickname}</div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button
            variant="default"
            onClick={() => {
              // Load current profile data into form when opening dialog
              if (profileData) {
                setFormData({
                  name: profileData.name || "",
                  nickname: profileData.nickname || "",
                  picture: profileData.picture || "",
                });
              }
              setIsEditOpen(true);
            }}
          >
            Edit profile
          </Button>

          <Button
            variant="outline"
            onClick={triggerPasswordResetEmail}
          >
            Change password
          </Button>
        </div>

        <p className="mt-4 text-sm text-muted-foreground">
          Click "Change password" to receive a password reset email. The email will contain a link to change your password securely.
        </p>

        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Profile</DialogTitle>
              <DialogDescription>
                Update your profile information. Changes are saved locally in your browser.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Nickname</label>
                <Input
                  value={formData.nickname}
                  onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                  placeholder="Enter your nickname"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium block mb-2">Upload Profile Picture</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const maxSize = 1024 * 1024; // 1MB
                    if (file.size > maxSize) {
                      alert("Please select an image smaller than 1MB.");
                      return;
                    }
                    const reader = new FileReader();
                    reader.onload = () => {
                      const dataUrl = reader.result;
                      setFormData((prev) => ({ ...prev, pictureDataUrl: dataUrl }));
                    };
                    reader.readAsDataURL(file);
                  }}
                />
                {formData.pictureDataUrl && (
                  <div className="mt-2 flex items-center gap-3">
                    <img
                      src={formData.pictureDataUrl}
                      alt="Preview"
                      className="w-16 h-16 rounded-full border border-border object-cover"
                    />
                    <span className="text-xs text-muted-foreground">Preview</span>
                  </div>
                )}
              </div>
              <div className="rounded-md bg-muted p-3 text-sm text-muted-foreground">
                <p className="font-medium mb-1">Note:</p>
                <p>
                  Changes are saved to your browser's localStorage. These changes will persist until you clear your browser data.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={async () => {
                  setIsSaving(true);
                  try {
                    // Save changes to localStorage
                    const updated = updateUserProfile({
                      name: formData.name,
                      nickname: formData.nickname,
                      pictureDataUrl: formData.pictureDataUrl,
                    });

                    if (updated) {
                      setProfileData(updated);
                      setIsEditOpen(false);
                      // Show success message
                      alert("Profile updated successfully! Changes saved locally.");
                    } else {
                      alert("Failed to save profile. Please try again.");
                    }
                  } catch (error) {
                    console.error("Error updating profile:", error);
                    alert("Failed to update profile. Please try again.");
                  } finally {
                    setIsSaving(false);
                  }
                }}
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}


