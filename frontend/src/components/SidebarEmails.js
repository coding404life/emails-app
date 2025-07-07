import React from "react";
import {
  Box,
  TextField,
  InputAdornment,
  Paper,
  List,
  ListItem,
  ListItemText,
  Typography,
  Avatar,
  Divider,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import { formatDate } from "@/util/util";

const SidebarEmails = ({
  filteredEmails,
  selectedEmail,
  handleEmailClick,
  searchQuery,
  setSearchQuery,
  getInitials,
}) => {
  return (
    <Paper
      elevation={1}
      sx={{
        width: 350,
        display: "flex",
        flexDirection: "column",
        borderRight: 1,
        borderColor: "divider",
      }}
    >
      {/* Search Bar */}
      <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
        <TextField
          fullWidth
          placeholder="Search emails..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
          size="small"
        />
      </Box>

      {/* Email List */}
      <Box sx={{ flex: 1, overflow: "auto" }}>
        <List sx={{ p: 0 }}>
          {filteredEmails.length > 0 ? (
            filteredEmails.map((email, index) => (
              <Box key={email.id}>
                <ListItem
                  button
                  onClick={() => handleEmailClick(email)}
                  selected={selectedEmail?.id === email.id}
                  sx={{
                    "&:hover": {
                      bgcolor: "action.hover",
                    },
                    "&.Mui-selected": {
                      bgcolor: "primary.light",
                      "&:hover": {
                        bgcolor: "primary.light",
                      },
                    },
                  }}
                >
                  <Avatar sx={{ mr: 2, bgcolor: "primary.main" }}>
                    {getInitials(email.to)}
                  </Avatar>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle2" noWrap>
                        {email.subject}
                      </Typography>
                    }
                    secondary={
                      <Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          noWrap
                        >
                          To: {email.to}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(email.timestamp)}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
                {index < filteredEmails.length - 1 && <Divider />}
              </Box>
            ))
          ) : (
            <Typography marginTop={3} textAlign="center">
              No Email Found
            </Typography>
          )}
        </List>
      </Box>
    </Paper>
  );
};

export default SidebarEmails;
