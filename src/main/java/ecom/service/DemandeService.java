package ecom.service;

import ecom.domain.Demande;
import ecom.repository.DemandeRepository;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link ecom.domain.Demande}.
 */
@Service
@Transactional
public class DemandeService {

    private static final Logger LOG = LoggerFactory.getLogger(DemandeService.class);

    private final DemandeRepository demandeRepository;

    public DemandeService(DemandeRepository demandeRepository) {
        this.demandeRepository = demandeRepository;
    }

    /**
     * Save a demande.
     *
     * @param demande the entity to save.
     * @return the persisted entity.
     */
    public Demande save(Demande demande) {
        LOG.debug("Request to save Demande : {}", demande);
        return demandeRepository.save(demande);
    }

    /**
     * Update a demande.
     *
     * @param demande the entity to save.
     * @return the persisted entity.
     */
    public Demande update(Demande demande) {
        LOG.debug("Request to update Demande : {}", demande);
        return demandeRepository.save(demande);
    }

    /**
     * Partially update a demande.
     *
     * @param demande the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<Demande> partialUpdate(Demande demande) {
        LOG.debug("Request to partially update Demande : {}", demande);

        return demandeRepository
            .findById(demande.getId())
            .map(existingDemande -> {
                if (demande.getDescription() != null) {
                    existingDemande.setDescription(demande.getDescription());
                }
                if (demande.getTypeBesoin() != null) {
                    existingDemande.setTypeBesoin(demande.getTypeBesoin());
                }
                if (demande.getGeolocalisation() != null) {
                    existingDemande.setGeolocalisation(demande.getGeolocalisation());
                }
                if (demande.getStatut() != null) {
                    existingDemande.setStatut(demande.getStatut());
                }
                if (demande.getIsArchived() != null) {
                    existingDemande.setIsArchived(demande.getIsArchived());
                }

                return existingDemande;
            })
            .map(demandeRepository::save);
    }

    /**
     * Get all the demandes.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<Demande> findAll(Pageable pageable) {
        LOG.debug("Request to get all Demandes");
        return demandeRepository.findAll(pageable);
    }

    /**
     * Get all the demandes with eager load of many-to-many relationships.
     *
     * @return the list of entities.
     */
    public Page<Demande> findAllWithEagerRelationships(Pageable pageable) {
        return demandeRepository.findAllWithEagerRelationships(pageable);
    }

    /**
     * Get one demande by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<Demande> findOne(Long id) {
        LOG.debug("Request to get Demande : {}", id);
        return demandeRepository.findOneWithEagerRelationships(id);
    }

    /**
     * Delete the demande by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete Demande : {}", id);
        demandeRepository.deleteById(id);
    }
}
