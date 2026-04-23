package ecom.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import ecom.domain.enumeration.StatutDemande;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Demande.
 */
@Entity
@Table(name = "demande")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Demande implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Lob
    @Column(name = "description", nullable = false)
    private String description;

    @NotNull
    @Column(name = "type_besoin", nullable = false)
    private String typeBesoin;

    @NotNull
    @Column(name = "geolocalisation", nullable = false)
    private String geolocalisation;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "statut", nullable = false)
    private StatutDemande statut;

    @Column(name = "is_archived")
    private Boolean isArchived;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "criseTouchees" }, allowSetters = true)
    private Utilisateur utilisateur;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "sinistres" }, allowSetters = true)
    private Crise crise;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Demande id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDescription() {
        return this.description;
    }

    public Demande description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getTypeBesoin() {
        return this.typeBesoin;
    }

    public Demande typeBesoin(String typeBesoin) {
        this.setTypeBesoin(typeBesoin);
        return this;
    }

    public void setTypeBesoin(String typeBesoin) {
        this.typeBesoin = typeBesoin;
    }

    public String getGeolocalisation() {
        return this.geolocalisation;
    }

    public Demande geolocalisation(String geolocalisation) {
        this.setGeolocalisation(geolocalisation);
        return this;
    }

    public void setGeolocalisation(String geolocalisation) {
        this.geolocalisation = geolocalisation;
    }

    public StatutDemande getStatut() {
        return this.statut;
    }

    public Demande statut(StatutDemande statut) {
        this.setStatut(statut);
        return this;
    }

    public void setStatut(StatutDemande statut) {
        this.statut = statut;
    }

    public Boolean getIsArchived() {
        return this.isArchived;
    }

    public Demande isArchived(Boolean isArchived) {
        this.setIsArchived(isArchived);
        return this;
    }

    public void setIsArchived(Boolean isArchived) {
        this.isArchived = isArchived;
    }

    public Utilisateur getUtilisateur() {
        return this.utilisateur;
    }

    public void setUtilisateur(Utilisateur utilisateur) {
        this.utilisateur = utilisateur;
    }

    public Demande utilisateur(Utilisateur utilisateur) {
        this.setUtilisateur(utilisateur);
        return this;
    }

    public Crise getCrise() {
        return this.crise;
    }

    public void setCrise(Crise crise) {
        this.crise = crise;
    }

    public Demande crise(Crise crise) {
        this.setCrise(crise);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Demande)) {
            return false;
        }
        return getId() != null && getId().equals(((Demande) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Demande{" +
            "id=" + getId() +
            ", description='" + getDescription() + "'" +
            ", typeBesoin='" + getTypeBesoin() + "'" +
            ", geolocalisation='" + getGeolocalisation() + "'" +
            ", statut='" + getStatut() + "'" +
            ", isArchived='" + getIsArchived() + "'" +
            "}";
    }
}
