## Formats

* [raw](#format-raw)
* [pretty](#format-pretty)
* [brief](#format-brief)
* [json](#format-json)

---

### Format `raw`

```
## [Unreleased]
### Changed
- Change feature 1
### Removed
- Remove feature 3
## [0.1.1] - 2016-09-22
### Added
- Add feature 6
### Changed
- Change feature 5
### Deprecated
- Depreacte feature 3
### Fixed
- Fix feature 2
- Fix feature 4
### Security
- Feature 3 is not secure
## [0.1.0] - 2016-09-22
### Added
- Add feature 1
- Add feature 2
- Add feature 2
- Add feature 3
- Add feature 4
- Add feature 5
```

[▲ Back to top](#commands)

---

### Format `pretty`

```
Unreleased
  Changed:
    - Change feature 1
  Removed:
    - Remove feature 3
v0.1.1 - 2016-09-22
  Added:
    - Add feature 6
  Changed:
    - Change feature 5
  Deprecated:
    - Depreacte feature 3
  Fixed:
    - Fix feature 2
    - Fix feature 4
  Security:
    - Feature 3 is not secure
v0.1.0 - 2016-09-22
  Added:
    - Add feature 1
    - Add feature 2
    - Add feature 2
    - Add feature 3
    - Add feature 4
    - Add feature 5
```

[▲ Back to top](#commands)

---

### Format `brief`

```
Unreleased
 ± Change feature 1
 - Remove feature 3
v0.1.1 - 2016-09-22
 + Add feature 6
 ± Change feature 5
 × Depreacte feature 3
 # Fix feature 2
 # Fix feature 4
 ! Feature 3 is not secure
v0.1.0 - 2016-09-22
 + Add feature 1
 + Add feature 2
 + Add feature 2
 + Add feature 3
 + Add feature 4
 + Add feature 5
```

[▲ Back to top](#commands)

---

### Format `json`

```js
{
  "Unreleased": {
    "date": null,
    "sections": {
      "Changed": [
        "Change feature 1"
      ],
      "Removed": [
        "Remove feature 3"
      ]
    }
  },
  "0.1.1": {
    "date": "2016-09-22",
    "sections": {
      "Added": [
        "Add feature 6"
      ],
      "Changed": [
        "Change feature 5"
      ],
      "Deprecated": [
        "Depreacte feature 3"
      ],
      "Fixed": [
        "Fix feature 2",
        "Fix feature 4"
      ],
      "Security": [
        "Feature 3 is not secure"
      ]
    }
  },
  "0.1.0": {
    "date": "2016-09-22",
    "sections": {
      "Added": [
        "Add feature 1",
        "Add feature 2",
        "Add feature 2",
        "Add feature 3",
        "Add feature 4",
        "Add feature 5"
      ]
    }
  }
}
```

[▲ Back to top](#commands)
