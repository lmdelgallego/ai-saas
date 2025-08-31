'use client'

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAuth } from '@/contexts/auth-context';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import z from 'zod';

const categories = [
  {
    id: 'technology',
    name: 'Technology',
    description: 'Latest tech news and innovation'
  },
  {
    id: 'business',
    name: 'Business',
    description: 'Business news, market trends and entrepreneurship'
  },
  {
    id: 'science',
    name: 'Science',
    description: 'Scientific discoveries and research breakthroughs'
  },
  {
    id: 'health',
    name: 'Health & Wellness',
    description: 'Health tips, medical advances and fitness advice'
  },
  {
    id: 'entertainment',
    name: 'Entertainment',
    description: 'Movies, music, TV shows and celebrity news'
  },
  {
    id: 'sports',
    name: 'Sports',
    description: 'Latest sports news, scores and highlights'
  },
  {
    id: 'lifestyle',
    name: 'Lifestyle',
    description: 'Fashion, food, travel and lifestyle trends'
  },
  {
    id: 'environment',
    name: 'Environment',
    description: 'Climate change, sustainability and environmental news'
  },
  {
    id: 'education',
    name: 'Education',
    description: 'Educational resources, learning tips and academic news'
  },
  {
    id: 'politics',
    name: 'Politics',
    description: 'Political news, policy updates and world affairs'
  },
  {
    id: 'art-culture',
    name: 'Art & Culture',
    description: 'Art exhibitions, cultural events and creative news'
  }
] as const;

const frequencyOptions = [
  {
    id: 'daily',
    name: 'Daily',
    description: 'Every day'
  },
  {
    id: 'weekly',
    name: 'Weekly',
    description: 'Once a week'
  },
  {
    id: 'bi-weekly',
    name: 'Bi-Weekly',
    description: 'Twice a week'
  }
] as const;

const FormSchema = z.object({
  categories: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: 'Please select at least one category'
  }),
  frequency: z.enum(frequencyOptions.map((item) => item.id)).refine((value) => value, {
    message: 'Please select a delivery frequency'
  })
})



const SelectPage = () => {

  const { user } = useAuth();
  const router = useRouter();

  const [ formdata, setFormData] = useState<z.infer<typeof FormSchema>>({
    categories: [],
    frequency: 'weekly'
  })

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      categories: [],
      frequency: 'weekly'
    }
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {

    try{
      const res = await fetch('/api/user-preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...data,
          email: user?.email
        }),
      });

      if(!res.ok) {
        alert('Failed to save user preferences. Please try again');
        return;
      }

      alert('User preferences saved successfully, you will receive a newsletter every ' + data.frequency);
      router.push('/dashboard');

    }
    catch (error) {
      alert('Failed to save user preferences. Please try again')
    }
  }

  useEffect(() => {
    setFormData({
      categories: form.watch('categories'),
      frequency: form.watch('frequency')
    });
  }, [form.watch('categories'), form.watch('frequency')]);

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg-px-8'>
      <div className='max-w-4xl mx-auto'>
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-bold text-gray-900 mb-4'>Customize Your Newsletter</h1>
          <p className='text-xl text-gray-600'>
            Select your interests and delivery frequency to start receiving personalize newsletters
          </p>
        </div>

        {/* Form Category */}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className='mb-8'>
              <h2 className='text-2xl font-semibold text-gray-900 mb-4'>Choose your categories</h2>
              <p className='text-gray-600 mb-6'>Select the topics you'd like to see in your personalized newsletter</p>

              <FormField
                control={form.control}
                name='categories'
                render={ () => (
                  <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
                    {categories.map((category) => (
                      <FormField
                        key={category.id}
                        control={form.control}
                        name='categories'
                        render={ ({ field }) => (
                          <FormItem key={category.id} className='bg-white border border-transparent flex items-center gap-4 p-4 rounded-md shadow-md has-[[aria-checked=true]]:border-gray-600 has-[[aria-checked=true]]:bg-gray-50 '>
                            <FormControl>
                              <Checkbox
                                checked={field.value.includes(category.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                  ? field.onChange([...field.value, category.id])
                                  : field.onChange(field.value.filter((item) => item !== category.id))
                                }}
                              />
                            </FormControl>
                            <FormLabel className='flex flex-col gap-1 items-start'>
                              <h3 className='text-lg leading-none font-semibold text-gray-900'>{category.name}</h3>
                              <p className='text-gray-600'>{category.description}</p>
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                )}
              />
            </div>

            <div className='mb-8'>
              <h2 className='text-2xl font-semibold text-gray-900 mb-4'>Delivery Frequency</h2>
              <p className='text-gray-600 mb-6'>How often would you like to receive your newsletter?</p>

              <FormField
                control={form.control}
                name='frequency'
                render={({ field }) => (
                  <FormItem >
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'
                      >
                        {frequencyOptions.map( (frequency) => (
                          <FormItem key={frequency.id} className='bg-white flex gap-4 p-4 border border-transparent rounded-md shadow-md has-[[aria-checked=true]]:border-gray-600 has-[[aria-checked=true]]:bg-gray-50'>
                            <FormControl>
                              <RadioGroupItem value={frequency.id}/>
                            </FormControl>
                            <FormLabel className='flex flex-col gap-1 items-start w-full cursor-pointer'>
                              <h3 className='text-lg leading-none font-semibold text-gray-900'>{frequency.name}</h3>
                              <p className='text-gray-600'>{frequency.description}</p>
                            </FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />

            </div>
            <div className='flex justify-end gap-4 items-center'>
              <div className='text-sm text-gray-600 flex items-center gap-1'>
                <span className='font-medium'>{formdata.categories.length}</span>
                <span>category{formdata.categories.length === 1 ? '' : 'ies'} selected</span>
                <span className='mx-1'>•</span>
                <span className='capitalize'>{formdata.frequency}</span>
                <span>delivery</span>
              </div>
              <Button type='submit' disabled={!form.formState.isValid}>Save Preferences</Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default SelectPage
