import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../shared/Button';
import Input from '../shared/Input';
import { CreateElectionData, VotingType } from '../../types/election.types';
import { apiRequest } from '../../services/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

interface CreateElectionFormProps {
  onSuccess?: () => void;
}

const CreateElectionForm: React.FC<CreateElectionFormProps> = ({ onSuccess }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CreateElectionData>({
    defaultValues: {
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      votingType: VotingType.SINGLE_CHOICE,
      isAnonymous: true,
      candidates: [{ name: '', description: '', photo: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'candidates',
  });

  const votingType = watch('votingType');

  const onSubmit = async (data: CreateElectionData) => {
    try {
      setLoading(true);

      // Validate dates
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);

      if (start >= end) {
        toast.error('End date must be after start date');
        return;
      }

      if (start < new Date()) {
        toast.error('Start date cannot be in the past');
        return;
      }

      // Validate candidates
      if (data.candidates.length < 2) {
        toast.error('At least 2 candidates are required');
        return;
      }

      // Clean up candidates data
      const cleanedData = {
        ...data,
        candidates: data.candidates.map((candidate, index) => ({
          ...candidate,
          position: index + 1,
        })),
      };

      const response = await apiRequest.post('/elections', cleanedData);
      toast.success('Election created successfully!');

      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/admin/elections');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to create election');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 bg-white rounded-lg shadow-md p-6"
    >
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Create New Election</h2>
        <p className="text-gray-600 mt-1">Fill in the details to create a new election</p>
      </div>

      {/* Election Details */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Election Title *
          </label>
          <Input
            {...register('title', { required: 'Title is required' })}
            placeholder="e.g., Board Member Election 2024"
            error={errors.title?.message}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description *
          </label>
          <textarea
            {...register('description', { required: 'Description is required' })}
            placeholder="Describe the purpose and details of this election..."
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date & Time *
            </label>
            <Input
              type="datetime-local"
              {...register('startDate', { required: 'Start date is required' })}
              error={errors.startDate?.message}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date & Time *
            </label>
            <Input
              type="datetime-local"
              {...register('endDate', { required: 'End date is required' })}
              error={errors.endDate?.message}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Voting Type *
            </label>
            <select
              {...register('votingType', { required: 'Voting type is required' })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={VotingType.SINGLE_CHOICE}>Single Choice</option>
              <option value={VotingType.MULTIPLE_CHOICE}>Multiple Choice</option>
              <option value={VotingType.RANKED}>Ranked Voting</option>
            </select>
          </div>

          <div className="flex items-center">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                {...register('isAnonymous')}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-sm font-medium text-gray-700">Anonymous Voting</span>
            </label>
          </div>
        </div>
      </div>

      {/* Candidates */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">Candidates</h3>
          <Button
            type="button"
            onClick={() => append({ name: '', description: '', photo: '' })}
            variant="secondary"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Candidate
          </Button>
        </div>

        <AnimatePresence>
          {fields.map((field, index) => (
            <motion.div
              key={field.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border border-gray-200 rounded-lg p-4 space-y-3"
            >
              <div className="flex justify-between items-center">
                <h4 className="font-medium text-gray-700">Candidate {index + 1}</h4>
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Candidate Name *
                </label>
                <Input
                  {...register(`candidates.${index}.name`, {
                    required: 'Candidate name is required',
                  })}
                  placeholder="Full name"
                  error={errors.candidates?.[index]?.name?.message}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description (Optional)
                </label>
                <textarea
                  {...register(`candidates.${index}.description`)}
                  placeholder="Brief description or bio..."
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Photo URL (Optional)
                </label>
                <Input
                  {...register(`candidates.${index}.photo`)}
                  placeholder="https://example.com/photo.jpg"
                />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Submit Button */}
      <div className="flex gap-4">
        <Button type="submit" loading={loading} className="flex-1">
          Create Election
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => navigate('/admin/elections')}
        >
          Cancel
        </Button>
      </div>
    </motion.form>
  );
};

export default CreateElectionForm;
