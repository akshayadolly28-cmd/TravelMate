package com.travelmate.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "packing_items")
public class PackingItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    @Column(length = 50)
    private String category = "ESSENTIALS"; // ESSENTIALS, CLOTHES, TOILETRIES, ELECTRONICS, DOCUMENTS, HEALTH

    @Column(name = "item_text", nullable = false, length = 200)
    private String itemText;

    @Column(name = "is_checked")
    private Boolean isChecked = false;

    @Column(name = "is_custom")
    private Boolean isCustom = false;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public PackingItem() {
    }

    public PackingItem(User user, String category, String itemText, Boolean isChecked, Boolean isCustom) {
        this.user = user;
        this.category = category;
        this.itemText = itemText;
        this.isChecked = isChecked;
        this.isCustom = isCustom;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getItemText() {
        return itemText;
    }

    public void setItemText(String itemText) {
        this.itemText = itemText;
    }

    public Boolean getIsChecked() {
        return isChecked;
    }

    public void setIsChecked(Boolean checked) {
        isChecked = checked;
    }

    public Boolean getIsCustom() {
        return isCustom;
    }

    public void setIsCustom(Boolean custom) {
        isCustom = custom;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
