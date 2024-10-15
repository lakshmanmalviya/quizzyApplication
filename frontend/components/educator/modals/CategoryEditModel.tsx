import { useAppDispatch } from '@/redux/hooks';
import { updateCategoryRequest } from '@/redux/slices/categorySlice';
import { checkIsBase64Icon } from '@/services/CommonServices';
import { buttonStyle, modalStyle } from '@/styles/CommonStyle.module';
import { Category } from '@/types/types';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import React, { ChangeEvent, useState } from 'react';


interface CategoryEditModalProps {
    category: Category;
    onClose: () => void;
}

const CategoryEditModal: React.FC<CategoryEditModalProps> = ({ category, onClose }) => {
    const dispatch = useAppDispatch();
    const [disable, setDisable] = useState<boolean>(true);
    const [categoryData, setCategoryData] = useState<Category>({
        id: category.id,
        name: category.name,
        description: category.description,
        categoryPic: category.categoryPic,
    });

    const [errors, setErrors] = useState<{ name?: string, description?: string }>({});

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: keyof Category) => {
        setDisable(false);
        setCategoryData((prevCategory) => ({
            ...prevCategory,
            [field]: e.target.value,
        }));
    };

    const validateForm = (): Boolean => {
        const newErrors: { name?: string; description?: string } = {};

        setCategoryData({
            ...categoryData,
            name: categoryData.name.trim(),
            description: categoryData.description.trim(),
        });

        if (!categoryData.name.trim()) {
            newErrors.name = "Name is required.";
        } else if (categoryData.name.trim().length < 3 || categoryData.name.trim().length > 100) {
            newErrors.name = "Name should have between 3 and 100 characters.";
        } else if (!/^[A-Za-z][A-Za-z0-9 ]*$/.test(categoryData.name.trim())) {
            newErrors.name = "Name should start with a letter and contain only letters, numbers, and spaces.";
        }

        if (!categoryData.description.trim()) {
            newErrors.description = "Description is required.";
        } else if (categoryData.description.trim().length < 10 || categoryData.description.trim().length > 255) {
            newErrors.description = "Description should have between 10 and 255 characters.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
        if (validateForm()) {
            setDisable(true);
            dispatch(updateCategoryRequest(categoryData));
        }
    };

    const handleCategoryPictureChange = (event: ChangeEvent<HTMLInputElement>) => {
        setDisable(false);
        const file = event.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            convertImageToBase64String(file);
        }
    };

    const convertImageToBase64String = (file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const result = (reader.result as string).replace('jpeg', 'png');
            setCategoryData((prevData) => ({
                ...prevData,
                categoryPic: result,
            }));
        };
        reader.readAsDataURL(file);
    };

    return (
        <>
            <Modal open={true}>
                <Box sx={modalStyle}>
                    <Typography variant="h6" component="h2">
                        Edit Category
                    </Typography>

                    <TextField
                        label="Name"
                        fullWidth
                        value={categoryData.name}
                        onChange={(e) => handleChange(e, 'name')}
                        margin="normal"
                        error={Boolean(errors.name)}
                        helperText={errors.name}
                    />

                    <TextField
                        label="Description"
                        fullWidth
                        multiline
                        rows={4}
                        value={categoryData.description}
                        onChange={(e) => handleChange(e, 'description')}
                        margin="normal"
                        error={Boolean(errors.description)}
                        helperText={errors.description}
                    />

                    <Box display="flex" alignItems="center" justifyContent={'center'} mt={1} mb={1}>
                        <input
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            id="category-pic-upload"
                            onChange={handleCategoryPictureChange}
                        />
                        <label htmlFor="category-pic-upload">
                            <img
                                src={checkIsBase64Icon(categoryData?.categoryPic)}
                                style={{ maxWidth: '500px', maxHeight: '150px', margin: 'auto', border: '3px solid white' }}
                            />
                        </label>
                    </Box>

                    <div style={buttonStyle}>
                        <Button onClick={handleSave} variant="contained" color="primary"
                            disabled={disable}>
                            Save
                        </Button>
                        <Button onClick={onClose} variant="outlined" color="secondary">
                            Cancel
                        </Button>
                    </div>
                </Box>
            </Modal>

        </>
    );
};

export default CategoryEditModal;
