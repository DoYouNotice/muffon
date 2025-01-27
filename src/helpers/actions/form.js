import i18n from '#/plugins/i18n'
import {
  camelCase
} from 'camel-case'
import {
  snakeCase
} from 'snake-case'
import {
  addFormFieldError
} from '@/helpers/actions/plugins/semantic'

export function handleError (
  {
    error,
    fields
  }
) {
  const isForbidden =
    error.response?.status === 403

  const isNotFound =
    error.response?.status === 404

  const form = this.$refs.form.$el

  if (isForbidden) {
    addErrors(
      {
        form,
        fields: this.fields,
        error
      }
    )
  } else if (isNotFound) {
    const notFoundError =
      i18n.global.t(
        'forms.errors.notFound'
      )

    addFormFieldError(
      form,
      'email',
      notFoundError
    )
  } else {
    this.error = error
  }
}

function addErrors (
  {
    form,
    fields,
    error
  }
) {
  const {
    errors
  } = error.response.data

  function addFieldsError (
    errorData
  ) {
    function addFieldError (
      field
    ) {
      const fieldToResponseField =
        snakeCase(
          field
        )

      const fieldError =
        errorData[
          fieldToResponseField
        ]

      if (fieldError) {
        const errorKey =
          camelCase(
            fieldError
          )

        const fieldKey =
          camelCase(
            field
          )

        const error = i18n.global.t(
          `forms.errors.${errorKey}.${fieldKey}`
        )

        addFormFieldError(
          form,
          field,
          error
        )
      }
    }

    fields.forEach(
      addFieldError
    )
  }

  errors.forEach(
    addFieldsError
  )
}
