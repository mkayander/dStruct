import { useEffect, useState } from 'react';
import type { useSession } from 'next-auth/react';
import axios from 'axios';
import S3 from 'aws-sdk/clients/s3';
import { trpc } from '@src/utils';

type SessionHook = ReturnType<typeof useSession>;
type Status = 'loading' | 'done';

const getAvatarFileName = (username: string, url: string, imageBlob: Blob) => {
    const origin = new URL(url).hostname.replaceAll('.', '-');

    return `/avatars/${username.replaceAll(' ', '_')}-avatar[${origin}].${imageBlob.type.split('/')[1]}`;
};

export const useProfileImageUploader = (session: SessionHook) => {
    const bucketImage = session.data?.user.bucketImage;
    const [status, setStatus] = useState<Status>(bucketImage ? 'done' : 'loading');

    const mutation = trpc.useMutation(['user.setBucketImage']);

    useEffect(() => {
        if (status === 'done') return;

        (async () => {
            if (!session.data || !session.data.user.image) return;

            const { data: imageBlob } = await axios.get<Blob>(session.data.user.image, { responseType: 'blob' });
            const filename = getAvatarFileName(
                session.data.user.name || session.data.user.id,
                session.data.user.image,
                imageBlob
            );
            const fileType = encodeURIComponent(imageBlob.type);

            const file = new File([imageBlob], filename);

            const awsResponse = await axios.get<S3.PresignedPost>(
                `/api/upload-url?file=${encodeURIComponent(filename)}&fileType=${fileType}`
            );
            const { url, fields } = awsResponse.data;

            const formData = new FormData();

            Object.entries({ ...fields, file }).forEach(([key, value]) => {
                formData.append(key, value as string);
            });

            await axios.post(url, formData);

            mutation.mutate({ imageName: filename });

            setStatus('done');
        })();
    }, [session.data]);

    return status;
};
