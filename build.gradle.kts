import org.springframework.boot.gradle.tasks.bundling.BootWar

plugins {
    java
    war
    id("org.springframework.boot") version "3.4.3"
    id("io.spring.dependency-management") version "1.1.0"
    id("org.jetbrains.kotlin.jvm") version "1.9.25"
}

group = "com.example"
version = "0.0.1-SNAPSHOT"

java {
    sourceCompatibility = JavaVersion.VERSION_17
    targetCompatibility = JavaVersion.VERSION_17
}

repositories {
    mavenCentral()
    maven {
        url = uri("https://jaspersoft.jfrog.io/jaspersoft/jaspersoft-repo")
    }
    maven {
        url = uri("https://jaspersoft.jfrog.io/jaspersoft/third-party-ce-artifacts/")
    }
}

dependencies {
    // Spring Boot
    implementation("org.springframework.boot:spring-boot-starter-data-jpa")
    implementation("org.springframework.boot:spring-boot-starter-freemarker")
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.springframework.boot:spring-boot-starter-validation")
    implementation("org.springframework.boot:spring-boot-starter-security")

    // Database
    implementation("org.hibernate:hibernate-envers:6.6.8.Final")
    implementation("org.flywaydb:flyway-core:10.20.1")
    implementation("org.flywaydb:flyway-mysql:10.20.1")
    runtimeOnly("com.mysql:mysql-connector-j")
    runtimeOnly("org.postgresql:postgresql")

    // Telegram
    implementation("org.telegram:telegrambots-spring-boot-starter:6.9.7.1")

    // Lombok
    compileOnly("org.projectlombok:lombok:1.18.36")
    annotationProcessor("org.projectlombok:lombok:1.18.36")

    // MapStruct
    implementation("org.mapstruct:mapstruct:1.5.5.Final")
    annotationProcessor("org.mapstruct:mapstruct-processor:1.5.5.Final")

    // Excel
    implementation("org.apache.poi:poi:5.2.5")
    implementation("org.apache.poi:poi-ooxml:5.2.5")
    implementation("com.jayway.jsonpath:json-path")

    // JasperReports
    implementation("net.sf.jasperreports:jasperreports:6.21.0")
    implementation("net.sf.jasperreports:jasperreports-fonts:6.21.0")

    // Provided scope dependencies
    providedRuntime("org.springframework.boot:spring-boot-starter-tomcat")

    // Test
    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testImplementation("org.springframework.security:spring-security-test")
    testImplementation("com.codeborne:selenide:7.10.1")
    testImplementation("io.rest-assured:rest-assured:6.0.0")
    testImplementation("org.junit.jupiter:junit-jupiter-api:5.10.1")
    testImplementation("org.junit.jupiter:junit-jupiter-params:5.10.1")
    testImplementation("org.seleniumhq.selenium:selenium-chrome-driver:4.15.0")
    testImplementation("io.qameta.allure:allure-maven:2.17.0")
    testImplementation("io.qameta.allure:allure-selenide:2.30.0")
    testRuntimeOnly("org.junit.jupiter:junit-jupiter-engine:5.10.1")

    //Скрипты Kotlin
    implementation("org.jetbrains.kotlin:kotlin-scripting-common:1.9.22")
    implementation("org.jetbrains.kotlin:kotlin-scripting-jvm:1.9.22")

    implementation("org.webjars.npm:bootstrap-table:1.24.1")
}

tasks.withType<JavaCompile> {

    options.compilerArgs.addAll(listOf("-parameters"))
}

tasks.withType<Test> {
    useJUnitPlatform()
}

tasks.named<BootWar>("bootWar") {
    archiveFileName.set("RCES.war")
}

tasks.withType<JavaCompile> {
    options.isFork = true
}

springBoot {
    buildInfo()
}

tasks.withType<War> {
    enabled = true
    archiveFileName.set("RCES.war")
}

/*file("gradle/scripts").listFiles{ f -> f.isFile && f.extension == "kts" }
    ?.sortedBy { it.name }
    ?.forEach { script ->
        try {
            logger. lifecycle("Исполнение скрипта: ${script.name}")
            apply(mapOf("from" to script))
        } catch (e: Exception) {
            logger.warn("Ошибка при исполнении скрипта ${script.name} : ${e.message}")
        }
    }
*/