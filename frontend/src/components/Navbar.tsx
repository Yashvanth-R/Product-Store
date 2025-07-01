import { Button, Container, Flex, HStack, Text, useColorMode } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { PlusSquareIcon } from "@chakra-ui/icons";
import { IoMoon } from "react-icons/io5";
import { LuSun } from "react-icons/lu";
import { motion } from "framer-motion";

const MotionContainer = motion(Container);

const Navbar = () => {
    const { colorMode, toggleColorMode } = useColorMode();


   return (
        <MotionContainer
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            maxW={{ base: "100%", md: "100%" }}
            px={{ base: 10, sm: 4, md: 8 }}
            py={{ base: 4, sm: 0 }}
        >
            <Flex
                h={{ base: "auto", sm: 16 }}
                alignItems={"center"}
                justifyContent={"space-between"}
                flexDir={{
                    base: "column",
                    sm: "row",
                }}
                gap={{ base: 2, sm: 0 }}
            >
                <Text
                    fontSize={{ base: "lg", sm: "2xl", md: "3xl" }}
                    fontWeight={"bold"}
                    textTransform={"uppercase"}
                    textAlign={"center"}
                    bgGradient={"linear(to-r, green.400, red.500)"}
                    bgClip={"text"}
                    mb={{ base: 2, sm: 0 }}
                >
                    <Link to={"/"}>Products Store 🛒</Link>
                </Text>

                <HStack
                    spacing={{ base: 1, sm: 2, md: 4 }}
                    alignItems={"center"}
                    wrap="wrap"
                >
                    <Link to={"/create"}>
                        <Button size={{ base: "sm", sm: "md" }}>
                            <PlusSquareIcon fontSize={{ base: 16, sm: 20 }} />
                        </Button>
                    </Link>
                    <Button
                        onClick={toggleColorMode}
                        size={{ base: "sm", sm: "md" }}
                        p={0}
                        minW={8}
                    >
                        {colorMode === "dark" ? (
                            <IoMoon size={20} />
                        ) : (
                            <LuSun size={20} />
                        )}
                    </Button>
                </HStack>
            </Flex>
        </MotionContainer>
    );
};
export default Navbar;