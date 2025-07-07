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
import { debounce } from "@/util/util";

export default function Home() {
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchEmails = async (query = "") => {
    try {
      const response = await fetch(
        `http://localhost:3001/emails${query.length ? `?query=${query}` : ""}`
      );

      if (response.ok) {
        const json = await response.json();
        console.log(json);

        return json.results;
      } else {
        throw new Error(`Response status: ${response.status}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // inital emails fetching
    fetchEmails().then((emails) => {
      setEmails(emails);
    });
  }, []);

  const debouncedSearch = useMemo(
    () =>
      debounce((value) => {
        fetchEmails(value).then((emails) => {
          setEmails(emails);
        });
      }, 500),
    []
  );

  useEffect(() => {
    debouncedSearch(searchQuery);
  }, [searchQuery]);

  const handleEmailClick = (email) => {
    setSelectedEmail(email);
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getInitials = (email) => {
    return email.split("@")[0].substring(0, 2).toUpperCase();
  };

  const handleComposeOpen = () => {
    setComposeOpen(true);
  };

  const sendEmail = async (emailData) => {
    const response = await fetch("http://localhost:3001/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(emailData),
    });
    if (!response.ok) throw new Error("Failed to save email");
    return await response.json();
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
        formatDate={formatDate}
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
                      {formatDate(selectedEmail.timestamp)}
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
    </Box>
  );
}
