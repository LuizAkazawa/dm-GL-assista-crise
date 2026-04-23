package ecom.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import ecom.domain.enumeration.TypeCrise;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.Set;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Crise.
 */
@Entity
@Table(name = "crise")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Crise implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Size(max = 100)
    @Column(name = "nom", length = 100, nullable = false)
    private String nom;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "nature", nullable = false)
    private TypeCrise nature;

    @NotNull
    @Column(name = "date_debut", nullable = false)
    private ZonedDateTime dateDebut;

    @Column(name = "date_fin")
    private ZonedDateTime dateFin;

    @Column(name = "is_active")
    private Boolean isActive;

    @ManyToMany(fetch = FetchType.LAZY, mappedBy = "criseTouchees")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "criseTouchees" }, allowSetters = true)
    private Set<Utilisateur> sinistres = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Crise id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNom() {
        return this.nom;
    }

    public Crise nom(String nom) {
        this.setNom(nom);
        return this;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public TypeCrise getNature() {
        return this.nature;
    }

    public Crise nature(TypeCrise nature) {
        this.setNature(nature);
        return this;
    }

    public void setNature(TypeCrise nature) {
        this.nature = nature;
    }

    public ZonedDateTime getDateDebut() {
        return this.dateDebut;
    }

    public Crise dateDebut(ZonedDateTime dateDebut) {
        this.setDateDebut(dateDebut);
        return this;
    }

    public void setDateDebut(ZonedDateTime dateDebut) {
        this.dateDebut = dateDebut;
    }

    public ZonedDateTime getDateFin() {
        return this.dateFin;
    }

    public Crise dateFin(ZonedDateTime dateFin) {
        this.setDateFin(dateFin);
        return this;
    }

    public void setDateFin(ZonedDateTime dateFin) {
        this.dateFin = dateFin;
    }

    public Boolean getIsActive() {
        return this.isActive;
    }

    public Crise isActive(Boolean isActive) {
        this.setIsActive(isActive);
        return this;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public Set<Utilisateur> getSinistres() {
        return this.sinistres;
    }

    public void setSinistres(Set<Utilisateur> utilisateurs) {
        if (this.sinistres != null) {
            this.sinistres.forEach(i -> i.removeCriseTouchee(this));
        }
        if (utilisateurs != null) {
            utilisateurs.forEach(i -> i.addCriseTouchee(this));
        }
        this.sinistres = utilisateurs;
    }

    public Crise sinistres(Set<Utilisateur> utilisateurs) {
        this.setSinistres(utilisateurs);
        return this;
    }

    public Crise addSinistre(Utilisateur utilisateur) {
        this.sinistres.add(utilisateur);
        utilisateur.getCriseTouchees().add(this);
        return this;
    }

    public Crise removeSinistre(Utilisateur utilisateur) {
        this.sinistres.remove(utilisateur);
        utilisateur.getCriseTouchees().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Crise)) {
            return false;
        }
        return getId() != null && getId().equals(((Crise) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Crise{" +
            "id=" + getId() +
            ", nom='" + getNom() + "'" +
            ", nature='" + getNature() + "'" +
            ", dateDebut='" + getDateDebut() + "'" +
            ", dateFin='" + getDateFin() + "'" +
            ", isActive='" + getIsActive() + "'" +
            "}";
    }
}
