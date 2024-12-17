import React, { Component } from "react";
import axios from "axios";

class FileUploadForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            title: "",
            description: "",
            selectedFile: null,
            selectedPicture: null,
            isFileDragging: false,
            isPictureDragging: false,
        };

        // Refs for file and picture inputs
        this.fileInputRef = React.createRef();
        this.pictureInputRef = React.createRef();
    }

    // Handle file input change
    handleFileChange = (event) => {
        this.setState({ selectedFile: event.target.files[0] });
    };

    // Handle picture input change
    handlePictureChange = (event) => {
        this.setState({ selectedPicture: event.target.files[0] });
    };

    // Handle drag and drop for file
    handleFileDrop = (event) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        if (file) {
            this.setState({ selectedFile: file, isFileDragging: false });
        }
    };

    // Handle drag and drop for picture
    handlePictureDrop = (event) => {
        event.preventDefault();
        const picture = event.dataTransfer.files[0];
        if (picture) {
            this.setState({ selectedPicture: picture, isPictureDragging: false });
        }
    };

    // Handle form submission
    handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("title", this.state.title);
        formData.append("description", this.state.description);
        formData.append("file", this.state.selectedFile);
        formData.append("picture", this.state.selectedPicture);

        const username = localStorage.getItem("user");
        if (username) {
            formData.append("username", username);
        }

        try {
            const response = await axios.post(
                "https://bixserver.azurewebsites.net/upload",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            console.log("Upload successful:", response.data);
        } catch (error) {
            console.error("Error uploading data:", error.response ? error.response.data : error.message);
        }
    };

    render() {
        const styles = {
            formContainer: {
                maxWidth: "900px",
                margin: "0 auto",
                padding: "25px",
                border: "1px solid #e0e0e0",
                borderRadius: "12px",
                backgroundColor: "#fff",
                boxShadow: "0 6px 15px rgba(0, 0, 0, 0.1)",
            },
            header: {
                textAlign: "center",
                color: "#333",
                marginBottom: "20px",
            },
            uploadForm: {
                display: "flex",
                flexDirection: "column",
            },
            gridLayout: {
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gridGap: "20px",
                marginBottom: "20px",
            },
            formGroup: {
                display: "flex",
                flexDirection: "column",
            },
            label: {
                marginBottom: "8px",
                color: "#333",
            },
            inputText: {
                width: "100%",
                padding: "12px",
                border: "1px solid #ccc",
                borderRadius: "6px",
                fontSize: "16px",
                color: "#333",
            },
            textarea: {
                resize: "vertical",
                width: "100%",
                padding: "12px",
                border: "1px solid #ccc",
                borderRadius: "6px",
                fontSize: "16px",
                color: "#333",
            },
            dropArea: {
                padding: "20px",
                border: "2px dashed #ccc",
                borderRadius: "6px",
                textAlign: "center",
                backgroundColor: "#fafafa",
                transition: "background-color 0.2s ease",
                cursor: "pointer",
            },
            dropAreaDragging: {
                backgroundColor: "#e8f4ff",
            },
            dropAreaHiddenInput: {
                display: "none",
            },
            dropAreaText: {
                color: "#555",
                fontSize: "14px",
            },
            submitButton: {
                padding: "12px 18px",
                border: "none",
                borderRadius: "6px",
                backgroundColor: "#28a745",
                color: "white",
                fontSize: "16px",
                cursor: "pointer",
                transition: "background-color 0.3s",
                alignSelf: "center",
                width: "100%",
            },
            submitButtonHover: {
                backgroundColor: "#218838",
            },
        };

        return (
            <div style={styles.formContainer}>
                <h2 style={styles.header}>File Upload Form</h2>
                <form onSubmit={this.handleSubmit} style={styles.uploadForm}>
                    <div style={styles.gridLayout}>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Title:</label>
                            <input
                                type="text"
                                style={styles.inputText}
                                value={this.state.title}
                                onChange={(e) => this.setState({ title: e.target.value })}
                                placeholder="Enter title"
                                required
                            />
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Description:</label>
                            <textarea
                                style={styles.textarea}
                                value={this.state.description}
                                onChange={(e) => this.setState({ description: e.target.value })}
                                placeholder="Enter description"
                                required
                            ></textarea>
                        </div>

                        <div
                            style={{
                                ...styles.dropArea,
                                ...(this.state.isFileDragging ? styles.dropAreaDragging : {}),
                            }}
                            onDragOver={(e) => {
                                e.preventDefault();
                                this.setState({ isFileDragging: true });
                            }}
                            onDragLeave={() => this.setState({ isFileDragging: false })}
                            onDrop={this.handleFileDrop}
                            onClick={() => this.fileInputRef.current.click()}
                        >
                            <label style={styles.label}>Upload File:</label>
                            <input
                                ref={this.fileInputRef}
                                type="file"
                                onChange={this.handleFileChange}
                                style={styles.dropAreaHiddenInput}
                                required
                            />
                            <p style={styles.dropAreaText}>
                                Drag & drop your file here or click to upload
                            </p>
                        </div>

                        <div
                            style={{
                                ...styles.dropArea,
                                ...(this.state.isPictureDragging ? styles.dropAreaDragging : {}),
                            }}
                            onDragOver={(e) => {
                                e.preventDefault();
                                this.setState({ isPictureDragging: true });
                            }}
                            onDragLeave={() => this.setState({ isPictureDragging: false })}
                            onDrop={this.handlePictureDrop}
                            onClick={() => this.pictureInputRef.current.click()}
                        >
                            <label style={styles.label}>Upload Picture:</label>
                            <input
                                ref={this.pictureInputRef}
                                type="file"
                                accept="image/*"
                                onChange={this.handlePictureChange}
                                style={styles.dropAreaHiddenInput}
                                required
                            />
                            <p style={styles.dropAreaText}>
                                Drag & drop your picture here or click to upload
                            </p>
                        </div>
                    </div>

                    <button
                        type="submit"
                        style={styles.submitButton}
                        onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor = styles.submitButtonHover.backgroundColor)
                        }
                        onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor = styles.submitButton.backgroundColor)
                        }
                    >
                        Upload
                    </button>
                </form>
            </div>
        );
    }
}

export default FileUploadForm;
