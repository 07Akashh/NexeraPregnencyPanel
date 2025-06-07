import { Drawer, Box, Divider } from "@mui/material"
import SectionContent from "./SectionContent"
import Image from "next/image"
import SectionIconList from './SectionIconList'

export default function MobileSidebar({ expanded, activeSection, onSectionClick, chatList, mobileOpen, onSidebarToggle, onChatSelect }) {
    return (
        <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={onSidebarToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
                display: { xs: "block", sm: "none" },
                "& .MuiDrawer-paper": {
                    boxSizing: "border-box",
                    width: 240,
                },
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    p: 2,
                }}
            >
                <Box
                    sx={{
                        position: 'relative',
                        width: '100%',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center'
                    }}
                >
                    <Image
                        src="/sidebarLogo.svg"
                        alt="AI Assistant Logo"
                        width={240}
                        height={60}
                    />
                </Box>
            </Box>
            <Divider sx={{mb:2}} />
            <SectionIconList activeSection={activeSection} onSectionClick={onSectionClick} />
            <SectionContent activeSection={activeSection} chatList={chatList} onChatSelect={onChatSelect} />
        </Drawer>
    )
}