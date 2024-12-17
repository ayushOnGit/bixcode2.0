import React, { Component } from 'react';
import axios from 'axios';
import icon from '../../components/signin/lbix_icon.png'

class SignIn extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isRegistering: false,
            formData: {
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                confirmPassword: '',
            },
        };
    }

    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState((prevState) => ({
            formData: {
                ...prevState.formData,
                [name]: value,
            },
        }));
    };

    handleRegister = async () => {
        const { firstName, lastName, email, password, confirmPassword } = this.state.formData;
        try {
            const response = await axios.post('https://bixserver.azurewebsites.net/auth/signup', { firstName, lastName, email, password, confirmPassword });
            alert(response.data.message);
        } catch (error) {
            alert(error.response?.data?.message || 'Signup failed');
            console.log(error);
        }
    };

    handleLogin = async () => {
        const { email, password } = this.state.formData;
        try {
            const response = await axios.post('https://bixserver.azurewebsites.net/auth/login', { email, password });
            alert(`Welcome ${response.data.name}! Role: ${response.data.role}`);

            // Save response data to localStorage
            localStorage.setItem('user', JSON.stringify({
                name: response.data.name,
                role: response.data.role,
                email,
                // Include any other data you want to store
            }));

            this.props.closeModal();
            window.location.reload();
        } catch (error) {
            alert(error.response?.data?.message || 'Login failed');
        }
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.state.isRegistering ? this.handleRegister() : this.handleLogin();
    };

    toggleRegistering = (isRegistering) => {
        this.setState({ isRegistering });
    };

    render() {
        const { isRegistering, formData } = this.state;
        const styles = {
            container: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '80vh',
                backgroundColor: '#f5f5f5',
            },
            box: {
                display: 'flex',
                width: '80%',
                maxWidth: '800px',
                borderRadius: '10px',
                overflow: 'hidden',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            },
            leftSection: {
                flex: '1',
                backgroundColor: '#4a90e2',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px',
                fontSize: '24px',
                fontWeight: 'bold',
            },
            rightSection: {
                flex: '1',
                backgroundColor: '#ffffff',
                padding: '40px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
            },
            header: {
                display: 'flex',
                justifyContent: 'flex-end',
                marginBottom: '20px',
            },
            button: {
                padding: '10px 20px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 'bold',
            },
            registerBtn: {
                backgroundColor: isRegistering ? '#4a90e2' : '#ddd',
                color: isRegistering ? '#fff' : '#000',
                marginRight: '10px',
            },
            signInBtn: {
                backgroundColor: !isRegistering ? '#4a90e2' : '#ddd',
                color: !isRegistering ? '#fff' : '#000',
            },
            form: {
                display: 'flex',
                flexDirection: 'column',
                gap: '15px',
                marginBottom: '20px',
            },
            inputField: {
                padding: '12px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '16px',
            },
            submitBtn: {
                padding: '12px',
                backgroundColor: '#4a90e2',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '16px',
            },
            links: {
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '14px',
            },
            link: {
                color: '#4a90e2',
                textDecoration: 'none',
            },
        };

        return (
            <div style={styles.container}>
                <div style={styles.box}>

                    <div style={styles.leftSection}>
            <img
                src= {icon} // Replace with the actual image URL or path
                alt="LearningBix Logo"
                style={{ width: '100px', height: '100px', marginRight: '10px' }} // Apply additional styling through styles.logo
            />
            LearningBix
        </div>
                    <div style={styles.rightSection}>
                        <div style={styles.header}>
                            <button
                                style={{ ...styles.button, ...styles.registerBtn }}
                                onClick={() => this.toggleRegistering(true)}
                            >
                                Register
                            </button>
                            <button
                                style={{ ...styles.button, ...styles.signInBtn }}
                                onClick={() => this.toggleRegistering(false)}
                            >
                                Sign In
                            </button>
                        </div>
                        <form style={styles.form} onSubmit={this.handleSubmit}>
                            {isRegistering && (
                                <>
                                    <input
                                        type="text"
                                        name="firstName"
                                        placeholder="First Name"
                                        value={formData.firstName}
                                        onChange={this.handleChange}
                                        style={styles.inputField}
                                        required
                                    />
                                    <input
                                        type="text"
                                        name="lastName"
                                        placeholder="Last Name"
                                        value={formData.lastName}
                                        onChange={this.handleChange}
                                        style={styles.inputField}
                                        required
                                    />
                                </>
                            )}
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={this.handleChange}
                                style={styles.inputField}
                                required
                            />
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={this.handleChange}
                                style={styles.inputField}
                                required
                            />
                            {isRegistering && (
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="Confirm Password"
                                    value={formData.confirmPassword}
                                    onChange={this.handleChange}
                                    style={styles.inputField}
                                    required
                                />
                            )}
                            <button type="submit" style={styles.submitBtn}>
                                {isRegistering ? 'Register' : 'Sign In'}
                            </button>
                        </form>
                        <div style={styles.links}>
                            <a href="#" style={styles.link}>Forgot Password?</a>
                            <a href="#" style={styles.link}>Forgot Username?</a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default SignIn;
