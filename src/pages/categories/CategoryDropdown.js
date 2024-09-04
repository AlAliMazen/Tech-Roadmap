import React, { useEffect, useState } from "react";
import { axiosReq } from "../../api/axiosDefaults";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import styles from "../../styles/CategoryDropdown.module.css"

const CategoryDropdown = ({ selectedCategory, setSelectedCategory }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axiosReq.get("/category/");
        setCategories(data);
      } catch (err) {
        setError("Failed to load categories");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <>
      <Form.Group className={`${styles.categoryDropdown}`}>
        <Form.Label>Category</Form.Label>
        {loading ? (
          <Alert variant="info">Loading categories...</Alert>
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : categories.length > 0 ? (
          <Form.Control
            className={`${styles.selectDropdown}`}
            as="select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option className={`${styles.selectDropdown}`} key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Form.Control>
        ) : (
          <Alert variant="warning">No categories available</Alert>
        )}
      </Form.Group>
    </>
  );
};

export default CategoryDropdown;
