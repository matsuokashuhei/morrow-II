# Atlas configuration for Morrow backend
# https://atlasgo.io/

data "external_schema" "ent" {
  program = [
    "go",
    "run",
    "-mod=mod",
    "entgo.io/ent/cmd/ent",
    "describe",
    "./ent/schema",
    "--format",
    "sql"
  ]
}

env "local" {
  src = data.external_schema.ent.url
  url = "postgres://morrow_user:morrow_password@localhost:5432/morrow_dev?sslmode=disable"
  dev = "postgres://morrow_user:morrow_password@localhost:5432/morrow_dev_atlas?sslmode=disable"
  migration {
    dir = "file://ent/migrate/migrations"
  }
  format {
    migrate {
      diff = "{{ sql . \"  \" }}"
    }
  }
}

env "docker" {
  src = data.external_schema.ent.url
  url = "postgres://morrow_user:morrow_password@postgres:5432/morrow_dev?sslmode=disable"
  dev = "postgres://morrow_user:morrow_password@postgres:5432/morrow_dev_atlas?sslmode=disable"
  migration {
    dir = "file://ent/migrate/migrations"
  }
  format {
    migrate {
      diff = "{{ sql . \"  \" }}"
    }
  }
}

env "test" {
  src = data.external_schema.ent.url
  url = "postgres://morrow_user:morrow_password@postgres:5432/morrow_test?sslmode=disable"
  dev = "postgres://morrow_user:morrow_password@postgres:5432/morrow_test_atlas?sslmode=disable"
  migration {
    dir = "file://ent/migrate/migrations"
  }
  format {
    migrate {
      diff = "{{ sql . \"  \" }}"
    }
  }
}

lint {
  destructive {
    error = true
  }
  data_depend {
    error = true
  }
  naming {
    error = true
  }
}
