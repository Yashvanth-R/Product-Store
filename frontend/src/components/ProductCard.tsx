import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
    Box,
    Button,
    Heading,
    HStack,
    IconButton,
    Image,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text,
    useColorModeValue,
    useDisclosure,
    useToast,
    VStack,
} from "@chakra-ui/react";
import { useProductStore } from "../store/product";
import { useState } from "react";
import { motion } from "framer-motion";

type Product = {
    _id?: string;
    name: string;
    price: number | string;
    image: string;
};

type ProductCardProps = {
    product: Product;
};

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const [updatedProduct, setUpdatedProduct] = useState<Product>(product);
    
    // Construct image URL - handle both local uploads and external URLs
    const getImageUrl = (imagePath: string): string => {
        if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
            return imagePath; // External URL
        }
        if (imagePath.startsWith('/uploads/')) {
            return imagePath; // Local file - use proxied path through vite dev server
        }
        return imagePath; // Fallback
    };
    
    const [imageSrc, setImageSrc] = useState<string>(getImageUrl(product.image));

    const textColor = useColorModeValue("gray.600", "gray.200");
    const bg = useColorModeValue("white", "gray.800");

    const { deleteProduct: deleteProductFromStore, updateProduct } = useProductStore();
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();

    // Handle image load errors with fallback
    const handleImageError = () => {
        setImageSrc("https://via.placeholder.com/300x300?text=No+Image");
    };

    const handleDeleteProduct = async (pid?: string) => {
        if (!pid) return;
        const { success, message } = await deleteProductFromStore(pid);
        if (!success) {
            toast({
                title: "Error",
                description: message,
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } else {
            toast({
                title: "Success",
                description: message,
                status: "success",
                duration: 3000,
                isClosable: true,
            });
        }
    };

        const handleUpdateProduct = async (pid?: string, updatedProduct?: Product) => {
        if (!pid || !updatedProduct) return;
        const productToSend = {
            ...updatedProduct,
            price: Number(updatedProduct.price), // Ensure price is a number
        };
        const { success, message } = await updateProduct(pid, productToSend);
        onClose();
        if (!success) {
            toast({
                title: "Error",
                description: message,
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } else {
            toast({
                title: "Success",
                description: "Product updated successfully",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    return (
        <Box
            shadow='lg'
            rounded='lg'
            overflow='hidden'
            transition='all 0.3s'
            _hover={{ transform: "translateY(-5px)", shadow: "xl" }}
            bg={bg}
        >
            <Image
                src={imageSrc}
                alt={product.name}
                h={64}
                w="full"
                maxH={64}
                objectFit="contain"
                objectPosition="center"
                borderTopRadius="lg"
                onError={handleImageError}
                />

            <Box p={4}>
                <Heading as='h3' size='md' mb={2}>
                    {product.name}
                </Heading>

                <Text fontWeight='bold' fontSize='xl' color={textColor} mb={4}>
                    ${product.price}
                </Text>

                <HStack spacing={2}>
                <motion.div whileHover={{ scale: 1.15 }}>
                    <IconButton aria-label="Edit" icon={<EditIcon />} onClick={onOpen} colorScheme='blue' />
                </motion.div>
                <motion.div whileHover={{ scale: 1.15 }}>
                    <IconButton
                        aria-label="Delete"
                        icon={<DeleteIcon />}
                        onClick={() => handleDeleteProduct(product._id)}
                        colorScheme='red'
                    />
                </motion.div>
            </HStack>
            </Box>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />

                <ModalContent>
                    <ModalHeader>Update Product</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <VStack spacing={4}>
                            <Input
                                placeholder='Product Name'
                                name='name'
                                value={updatedProduct.name}
                                onChange={(e) => setUpdatedProduct({ ...updatedProduct, name: e.target.value })}
                            />
                            <Input
                                placeholder='Price'
                                name='price'
                                type='number'
                                value={updatedProduct.price}
                                onChange={(e) => setUpdatedProduct({ ...updatedProduct, price: e.target.value })}
                            />
                            <Input
                                placeholder='Image URL'
                                name='image'
                                value={updatedProduct.image}
                                onChange={(e) => setUpdatedProduct({ ...updatedProduct, image: e.target.value })}
                            />
                        </VStack>
                    </ModalBody>

                    <ModalFooter>
                        <Button
                            colorScheme='blue'
                            mr={3}
                            onClick={() => handleUpdateProduct(product._id, updatedProduct)}
                        >
                            Update
                        </Button>
                        <Button variant='ghost' onClick={onClose}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    );
};
export default ProductCard;