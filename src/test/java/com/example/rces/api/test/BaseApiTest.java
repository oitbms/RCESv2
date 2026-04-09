package com.example.rces.api.test;

import io.restassured.specification.RequestSpecification;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;

import static com.example.rces.api.Specs.request;
import static io.restassured.RestAssured.given;

public class BaseApiTest {
    private static final Path TOKEN_FILE = Paths.get("build/tmp/test-token.txt");
    private static String token;
    private static final String API_AUTH_USERNAME = System.getProperty("api.auth.username", System.getenv().getOrDefault("API_AUTH_USERNAME", "admin"));
    private static final String API_AUTH_PASSWORD = System.getProperty("api.auth.password", System.getenv().getOrDefault("API_AUTH_PASSWORD", "admin"));

    public static synchronized String getJwtToken() {
        if (token != null) return token;
        token = loadTokenFromFile();
        if (token != null) return token;

        token = given()
                .spec(request())
                .basePath("/api/auth/login")
                .body(Map.of(
                        "username", API_AUTH_USERNAME,
                        "password", API_AUTH_PASSWORD
                ))
                .post()
                .then()
                .statusCode(200)
                .extract().asString();

        saveTokenToFile(token);
        return token;
    }

    private static String loadTokenFromFile() {
        try {
            if (Files.exists(TOKEN_FILE)) {
                return Files.readString(TOKEN_FILE).trim();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    private static void saveTokenToFile(String token) {
        try {
            Files.createDirectories(TOKEN_FILE.getParent());
            Files.writeString(TOKEN_FILE, token);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static RequestSpecification getAuthorizedRequestSpec() {
        return given()
                .spec(request())
                .header("Authorization", "Bearer " + getJwtToken());
    }
}
