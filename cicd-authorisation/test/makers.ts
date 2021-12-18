type BucketTemplate = { Resources: Record<string, unknown> };

export function makeCICDBucketTemplate(logicalId: string, bucketName: string): BucketTemplate {
  return {
    Resources: {
      [logicalId]: {
        Type: 'AWS::S3::Bucket',
        Properties: {
          BucketName: bucketName,
          PublicAccessBlockConfiguration: {
            BlockPublicAcls: true,
            BlockPublicPolicy: true,
            IgnorePublicAcls: true,
            RestrictPublicBuckets: true,
          },
        },
        UpdateReplacePolicy: 'Delete',
        DeletionPolicy: 'Delete',
      },
    },
  };
}
