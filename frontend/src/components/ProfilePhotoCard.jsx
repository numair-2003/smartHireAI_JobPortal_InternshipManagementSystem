import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import api from '../services/api';
import { updateCurrentUser } from '../features/authSlice';
import Icon from './Icon';
import UserAvatar from './UserAvatar';

const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp'];
const maxImageSize = 2 * 1024 * 1024;

const ProfilePhotoCard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [uploading, setUploading] = useState(false);

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!allowedImageTypes.includes(file.type)) {
      toast.error('Choose a JPG, PNG, or WEBP image');
      e.target.value = '';
      return;
    }

    if (file.size > maxImageSize) {
      toast.error('Profile photo must be 2MB or smaller');
      e.target.value = '';
      return;
    }

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      setUploading(true);
      const { data } = await api.post('/auth/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      dispatch(updateCurrentUser({ avatar: data.avatar }));
      toast.success('Profile photo uploaded');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Photo upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  return (
    <div className="card">
      <div className="flex flex-wrap items-center gap-5">
        <UserAvatar user={user} size="xl" />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-950">Profile photo</h2>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                Add a professional photo that appears in your account header and profile.
              </p>
            </div>
            <div className="icon-tile bg-primary-50 text-primary-700 ring-primary-100">
              <Icon name="upload" className="h-5 w-5" />
            </div>
          </div>

          <label className="mt-5 block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">
              Upload photo
            </span>
            <input
              type="file"
              accept=".jpg,.jpeg,.png,.webp"
              onChange={handlePhotoUpload}
              disabled={uploading}
              className="input-field"
            />
          </label>

          <p className="mt-3 text-xs text-slate-500">
            JPG, PNG, or WEBP. Maximum size 2MB.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePhotoCard;
