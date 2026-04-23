package ecom.repository;

import ecom.domain.Utilisateur;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.IntStream;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

/**
 * Utility repository to load bag relationships based on https://vladmihalcea.com/hibernate-multiplebagfetchexception/
 */
public class UtilisateurRepositoryWithBagRelationshipsImpl implements UtilisateurRepositoryWithBagRelationships {

    private static final String ID_PARAMETER = "id";
    private static final String UTILISATEURS_PARAMETER = "utilisateurs";

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<Utilisateur> fetchBagRelationships(Optional<Utilisateur> utilisateur) {
        return utilisateur.map(this::fetchCriseTouchees);
    }

    @Override
    public Page<Utilisateur> fetchBagRelationships(Page<Utilisateur> utilisateurs) {
        return new PageImpl<>(
            fetchBagRelationships(utilisateurs.getContent()),
            utilisateurs.getPageable(),
            utilisateurs.getTotalElements()
        );
    }

    @Override
    public List<Utilisateur> fetchBagRelationships(List<Utilisateur> utilisateurs) {
        return Optional.of(utilisateurs).map(this::fetchCriseTouchees).orElse(Collections.emptyList());
    }

    Utilisateur fetchCriseTouchees(Utilisateur result) {
        return entityManager
            .createQuery(
                "select utilisateur from Utilisateur utilisateur left join fetch utilisateur.criseTouchees where utilisateur.id = :id",
                Utilisateur.class
            )
            .setParameter(ID_PARAMETER, result.getId())
            .getSingleResult();
    }

    List<Utilisateur> fetchCriseTouchees(List<Utilisateur> utilisateurs) {
        HashMap<Object, Integer> order = new HashMap<>();
        IntStream.range(0, utilisateurs.size()).forEach(index -> order.put(utilisateurs.get(index).getId(), index));
        List<Utilisateur> result = entityManager
            .createQuery(
                "select utilisateur from Utilisateur utilisateur left join fetch utilisateur.criseTouchees where utilisateur in :utilisateurs",
                Utilisateur.class
            )
            .setParameter(UTILISATEURS_PARAMETER, utilisateurs)
            .getResultList();
        Collections.sort(result, (o1, o2) -> Integer.compare(order.get(o1.getId()), order.get(o2.getId())));
        return result;
    }
}
