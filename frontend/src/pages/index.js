import { useState, useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  Divider,
  Fab,
  Grid,
  Card,
  CardContent,
  Avatar,
} from "@mui/material";
import { Email as EmailIcon, Add as AddIcon } from "@mui/icons-material";
import SidebarEmails from "@/components/SidebarEmails";
import { debounce, formatDate } from "@/util/util";
import EmailDialog from "@/components/EmailDialog";

export default function Home() {
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [composeOpen, setComposeOpen] = useState(false);
  const [composeForm, setComposeForm] = useState({
    to: "",
    cc: "",
    bcc: "",
    subject: "",
    body: "",
  });

  const handleFormChange = (field, value) =>
    setComposeForm((f) => ({ ...f, [field]: value }));
  const handleComposeOpen = () => setComposeOpen(true);
  const handleComposeClose = () => {
    setComposeOpen(false);
    setComposeForm({ to: "", cc: "", bcc: "", subject: "", body: "" });
  };

  const fetchEmails = async (query = "") => {
    try {
      const response = await fetch(
        `http://localhost:3001/emails${query.length ? `?query=${query}` : ""}`
      );

      if (response.ok) {
        const json = await response.json();

        setEmails(json.results);

        return json.results;
      } else {
        throw new Error(`Response status: ${response.status}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleComposeSubmit = async () => {
    await fetch("http://localhost:3001/new-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(composeForm),
    });
    handleComposeClose();

    // fetch emails list from backend => we could also update the email list in the client side
    fetchEmails();
  };

  useEffect(() => {
    // inital emails fetching
    fetchEmails();
  }, []);

  const debouncedSearch = useMemo(
    () =>
      debounce((value) => {
        fetchEmails(value);
      }, 500),
    []
  );

  useEffect(() => {
    debouncedSearch(searchQuery);
  }, [searchQuery]);

  const handleEmailClick = (email) => {
    setSelectedEmail(email);
  };

  const getInitials = (email) => {
    return email.split("@")[0].substring(0, 2).toUpperCase();
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", bgcolor: "#f5f5f5" }}>
      <SidebarEmails
        filteredEmails={emails}
        selectedEmail={selectedEmail}
        handleEmailClick={handleEmailClick}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        getInitials={getInitials}
      />

      {/* Main Content Area */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {selectedEmail ? (
          <Card sx={{ m: 2, flex: 1 }}>
            <CardContent>
              {/* Email Header */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h5" gutterBottom>
                  {selectedEmail.subject}
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Avatar sx={{ mr: 2, bgcolor: "primary.main" }}>
                    {getInitials(selectedEmail.to)}
                  </Avatar>
                  <Box>
                    <Typography variant="body1">
                      From: {selectedEmail.to}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(selectedEmail.created_at)}
                    </Typography>
                  </Box>
                </Box>

                {/* Email Details */}
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  {selectedEmail.cc && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        CC: {selectedEmail.cc}
                      </Typography>
                    </Grid>
                  )}
                  {selectedEmail.bcc && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        BCC: {selectedEmail.bcc}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </Box>

              <Divider sx={{ mb: 3 }} />

              {/* Email Body */}
              <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
                {selectedEmail.body}
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <Box
            sx={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <EmailIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              Select an email to view
            </Typography>
          </Box>
        )}
      </Box>

      {/* Compose Button */}
      <Fab
        color="primary"
        aria-label="compose"
        onClick={handleComposeOpen}
        sx={{
          position: "fixed",
          bottom: 25,
          right: 25,
        }}
      >
        <AddIcon />
      </Fab>
      <EmailDialog
        open={composeOpen}
        onClose={handleComposeClose}
        form={composeForm}
        onFormChange={handleFormChange}
        onSubmit={handleComposeSubmit}
      />
    </Box>
  );
}
