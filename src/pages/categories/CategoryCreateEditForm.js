import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import { axiosReq, axiosRes } from "../../api/axiosDefaults";
import btnStyles from "../../styles/Button.module.css";

const CategoryCreateEditForm = () => {
    const [categoryData, setCategoryData] = useState({
        title: "",
        description: "",
    });
    const { title, description } = categoryData;
    const [errors, setErrors] = useState({});
    const { id } = useParams(); // For editing an existing category
    const history = useHistory();

    useEffect(() => {
        if (id) {
            const fetchCategory = async () => {
                try {
                    const { data } = await axiosReq.get(`/category/${id}/`);
                    setCategoryData({
                        title: data.title,
                        description: data.description,
                    });
                } catch (err) {
                    //console.log(err);
                    setErrors({ general: "Failed to fetch category" });
                }
            };
            fetchCategory();
        }
    }, [id]);

    const handleChange = (event) => {
        setCategoryData({
            ...categoryData,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            await axiosRes.post("/category/", categoryData);

            history.push("/category"); // Redirect after creating/editing
        } catch (err) {
            //console.log(err);
            setErrors(err.response?.data);
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group>
                <Form.Label>Category Name</Form.Label>
                <Form.Control
                    type="text"
                    name="title"
                    value={title}
                    onChange={handleChange}
                />
            </Form.Group>
            {errors.name && <Alert variant="warning">{errors.name}</Alert>}

            <Form.Group>
                <Form.Label>Description</Form.Label>
                <Form.Control
                    as="textarea"
                    name="description"
                    value={description}
                    onChange={handleChange}
                    rows={3}
                />
            </Form.Group>
            {errors.description && <Alert variant="warning">{errors.description}</Alert>}

            <Button
                className={`${btnStyles.Button} ${btnStyles.Blue}`}
                onClick={() => history.goBack()}
            >
                Cancel
            </Button>
            <Button className={`${btnStyles.Button} ${btnStyles.Blue}`} type="submit">
                Save
            </Button>
        </Form>
    );
};

export default CategoryCreateEditForm;
