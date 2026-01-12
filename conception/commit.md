# Crée et pousse la branche dev

git checkout -b dev
git push -u origin dev

Définit dev comme branche par défaut sur GitHub
(à faire dans Settings > Branches > Default branch)
Protège main et dev
(à faire dans Settings > Branches > Branch protection rules)

---

## ✅ 9. Convention de nommage des branches

**Format recommandé** :

feature/nom-de-la-feature
fix/nom-du-bug
chore/tache-technique
docs/mise-a-jour-doc
**Exemples** :

feature/auth-register
feature/challenge-create
fix/docker-compose-healthcheck
chore/eslint-config
docs/readme-update

---

## ✅ 10. Convention de commit

**Format recommandé (Conventional Commits)** :

type(scope): description courte

[corps optionnel]

[footer optionnel]
**Types** :

- `feat`: nouvelle fonctionnalité
- `fix`: correction de bug
- `chore`: tâche technique (config, deps)
- `docs`: documentation
- `style`: formatage (ESLint, Prettier)
- `refactor`: refactoring
- `test`: ajout/modification de tests

**Exemples** :

feat(auth): add user registration endpoint
fix(docker): correct healthcheck timeout
chore(deps): update prisma to 7.2.0
docs(readme): add installation steps
