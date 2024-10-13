
export enum jobType {
  FREELANCE = 'FREELANCE',
  EMPLOYEE = 'EMPLOYEE',
  CONSUMER  = 'INDIVIDUAL',
}


export const JobTypeLabels: {[key in jobType]: string} = {
  [jobType.FREELANCE]: 'Freelance',
  [jobType.EMPLOYEE]: 'Employé',
  [jobType.CONSUMER ]: 'Particulier',
}

export const JobTypeDropdown: { label: string, value: jobType }[] = Object.entries(JobTypeLabels).map(([key, label]) => ({
  label,
  value: key as jobType,
}));