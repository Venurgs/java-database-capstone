package com.project.back_end.DTO;

public class Login {

    private String identifier; // email o username
    private String password;

    // Constructor vacío
    public Login() {
    }

    // Constructor con campos
    public Login(String identifier, String password) {
        this.identifier = identifier;
        this.password = password;
    }

    // --- Getters y Setters ---

    public String getIdentifier() {
        return identifier;
    }

    public void setIdentifier(String identifier) {
        this.identifier = identifier;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}