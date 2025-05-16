package com.example.rces.models;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.Base64;
import java.util.UUID;

@Entity
@Table(name = "images")
public class Images {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", nullable = false)
    private UUID id;

    @Column(name = "name")
    private String name;

    @Lob
    private byte[] data;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "request_id")
    private Requests request;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sgi_id")
    private FactExecutionSGI sgi;

    public Images() {
    }

    public Images(String base64, Requests request) {
        setBase64Data(base64);
        setName("Фото от " + LocalDateTime.now());
        setRequest(request);
    }

    public Images(String base64, FactExecutionSGI sgi) {
        setBase64Data(base64);
        setName("Фото от " + LocalDateTime.now());
        setSgi(sgi);
    }


    public String getBase64Data() {
        return data != null ? "data:image/png;base64," + Base64.getEncoder().encodeToString(data) : "";
    }

    public void setBase64Data(String base64Image) {
        setData(Base64.getDecoder().decode(base64Image.substring("data:image/jpeg;base64,".length())));
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public byte[] getData() {
        return data;
    }

    public void setData(byte[] data) {
        this.data = data;
    }

    public Requests getRequest() {
        return request;
    }

    public void setRequest(Requests request) {
        this.request = request;
    }

    public FactExecutionSGI getSgi() {
        return sgi;
    }

    public void setSgi(FactExecutionSGI sgi) {
        this.sgi = sgi;
    }
}
