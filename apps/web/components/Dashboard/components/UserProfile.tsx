import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";

export interface UserProfileProps {
  name?: string;
  email?: string;
  picture?: string;
}

export default function UserProfile({
  name,
  email,
  picture,
}: UserProfileProps) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1.5}
      sx={{ px: 2, py: 1.5 }}
    >
      <Avatar src={picture} alt="UserPic" sx={{ width: 36, height: 36 }} />
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="body2" fontWeight={600} noWrap>
          {name}
        </Typography>
        <Typography variant="caption" color="text.secondary" noWrap>
          {email}
        </Typography>
      </Box>
    </Stack>
  );
}
