package ecom.service;

import ecom.domain.Utilisateur;
import ecom.repository.UtilisateurRepository;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link ecom.domain.Utilisateur}.
 */
@Service
@Transactional
public class UtilisateurService {

    private static final Logger LOG = LoggerFactory.getLogger(UtilisateurService.class);

    private final UtilisateurRepository utilisateurRepository;

    public UtilisateurService(UtilisateurRepository utilisateurRepository) {
        this.utilisateurRepository = utilisateurRepository;
    }

    /**
     * Save a utilisateur.
     *
     * @param utilisateur the entity to save.
     * @return the persisted entity.
     */
    public Utilisateur save(Utilisateur utilisateur) {
        LOG.debug("Request to save Utilisateur : {}", utilisateur);
        return utilisateurRepository.save(utilisateur);
    }

    /**
     * Update a utilisateur.
     *
     * @param utilisateur the entity to save.
     * @return the persisted entity.
     */
    public Utilisateur update(Utilisateur utilisateur) {
        LOG.debug("Request to update Utilisateur : {}", utilisateur);
        return utilisateurRepository.save(utilisateur);
    }

    /**
     * Partially update a utilisateur.
     *
     * @param utilisateur the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<Utilisateur> partialUpdate(Utilisateur utilisateur) {
        LOG.debug("Request to partially update Utilisateur : {}", utilisateur);

        return utilisateurRepository
            .findById(utilisateur.getId())
            .map(existingUtilisateur -> {
                if (utilisateur.getNom() != null) {
                    existingUtilisateur.setNom(utilisateur.getNom());
                }
                if (utilisateur.getPrenom() != null) {
                    existingUtilisateur.setPrenom(utilisateur.getPrenom());
                }
                if (utilisateur.getEmail() != null) {
                    existingUtilisateur.setEmail(utilisateur.getEmail());
                }
                if (utilisateur.getIsBanned() != null) {
                    existingUtilisateur.setIsBanned(utilisateur.getIsBanned());
                }

                return existingUtilisateur;
            })
            .map(utilisateurRepository::save);
    }

    /**
     * Get all the utilisateurs.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<Utilisateur> findAll(Pageable pageable) {
        LOG.debug("Request to get all Utilisateurs");
        return utilisateurRepository.findAll(pageable);
    }

    /**
     * Get all the utilisateurs with eager load of many-to-many relationships.
     *
     * @return the list of entities.
     */
    public Page<Utilisateur> findAllWithEagerRelationships(Pageable pageable) {
        return utilisateurRepository.findAllWithEagerRelationships(pageable);
    }

    /**
     * Get one utilisateur by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<Utilisateur> findOne(Long id) {
        LOG.debug("Request to get Utilisateur : {}", id);
        return utilisateurRepository.findOneWithEagerRelationships(id);
    }

    /**
     * Delete the utilisateur by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete Utilisateur : {}", id);
        utilisateurRepository.deleteById(id);
    }
}
